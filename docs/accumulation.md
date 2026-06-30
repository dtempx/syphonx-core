# Field Accumulation

When the same output field is produced more than once during a run, SyphonX does **not** overwrite the earlier result — it **merges** the new result into the existing one. For a `repeated` field this means the second batch is **appended** onto the first, the third onto that, and so on. We call this **field accumulation**: a single named field grows by collecting results from every step that targets it.

```json
{
    "actions": [
        { "select": [{ "name": "products", "repeated": true, "query": [["main .product"]] }] },
        { "click": { "query": [["#tab-more"]] } },
        { "select": [{ "name": "products", "repeated": true, "query": [[".related-products-tab .product"]] }] }
    ]
}
```

Both `select` actions write to `products`. Instead of the second overwriting the first, the engine concatenates them — `data.products` ends up holding every product from the initial page **and** every product revealed by clicking the tab.

---

## Why this is useful

The same value is often spread across several steps of a page's lifecycle: an initial render, a "load more" click, a second tab, a paginated next page, a navigation to a detail view. Accumulation lets you treat all of those as contributions to **one** field rather than stitching separate arrays together afterward:

- Gather a list of products on the main page, click a tab, and append the products that appear after the click.
- Collect rows page by page while paginating (see [the repeat pattern](#accumulation-inside-repeat) below).
- Pull items out of several different DOM regions into one merged list.

The defining trait is that the field name is the **join key**. Anything you emit under the same name lands in the same place.

---

## How merging works

Accumulation is powered by the `merge` helper ([`package/lib/merge.ts`](../package/lib/merge.ts)), which the controller applies whenever it folds a freshly produced result into the accumulated `data`. It is a recursive deep merge, and the rule depends on the **types** of the two values:

| Existing value | New value | Result |
|----------------|-----------|--------|
| Array | Array | **Concatenated** — `[...existing, ...new]` (existing first, new appended) |
| Object | Object | Merged **key by key**, each key recursively merged |
| anything | a truthy scalar | The **new** value replaces the old (latest non-empty wins) |
| anything | empty / `undefined` | The **existing** value is kept |

```js
// simplified from package/lib/merge.ts
if (source is Array && target is Array)  return [...source, ...target]; // append
if (source is Object && target is Object) return mergeEachKeyRecursively(source, target);
return target || source; // scalar: latest non-empty wins
```

The two consequences worth internalizing:

1. **`repeated: true` fields accumulate (append).** Because their value is an array, re-selecting the same name concatenates.
2. **Plain (non-repeated) scalar fields do not accumulate — they get overwritten.** The latest non-empty value wins. If a field is selected twice and you wanted both values, make it `repeated`.

Object fields merge structurally, so re-emitting a `type: "object"` field under the same name fills in or updates keys rather than replacing the whole object.

---

<a id="accumulation-inside-repeat"></a>
## Accumulation inside `repeat`

The most common place accumulation shows up is pagination with [`repeat`](features.md). Each iteration re-runs the same `select`, and because the field is `repeated`, the iterations accumulate into one growing array. This is exactly how `test/repeat/1.ts` paginates a fixture:

```json
{ "repeat": { "limit": 10, "actions": [
    { "select": [{ "name": "titles", "repeated": true, "query": [["h1"]] }] },
    { "break": { "query": [["#next"]], "on": "none" } },
    { "click": { "query": [["#next"]] } },
    { "yield": { "params": { "waitUntil": "domcontentloaded" } } }
]}}
```

Each page contributes its `<h1>` to `titles`. After five pages the accumulated result is:

```json
{ "titles": ["First", "Second", "Third", "Fourth", "Fifth"] }
```

No manual concatenation step is needed — the field accumulates across the loop on its own.

---

## Multi-step example (tabs / load-more)

Accumulation is not limited to `repeat`. Any sequence of actions that emit the same field contributes to it. A typical "main list, then reveal more" flow:

```json
{ "actions": [
    { "select": [{ "name": "items", "repeated": true, "query": [[".result"]] }] },

    { "click": { "query": [["button.load-more"]] } },
    { "yield": { "params": { "waitUntil": "networkidle" } } },
    { "select": [{ "name": "items", "repeated": true, "query": [[".result"]] }] },

    { "click": { "query": [["#tab-archived"]] } },
    { "select": [{ "name": "items", "repeated": true, "query": [[".result"]] }] }
] }
```

`data.items` ends up holding the initial results, plus the ones loaded by the button, plus the ones under the archived tab — all in one flat array, in the order they were collected.

---

## Tips and gotchas

- **Want both values but only getting the last one?** The field is probably non-repeated. Scalars overwrite; only arrays append. Add `repeated: true`.
- **Need uniqueness across steps?** Accumulation appends *everything*, including duplicates that appear on more than one step. Add [`distinct: true`](features.md) to collapse duplicates in the merged array.
- **Order matters.** Results are appended in the order their actions run — earlier steps come first in the final array.
- **Empty steps are harmless.** A step that matches nothing contributes an empty array (or no value), leaving the accumulated result unchanged.
- **`each` does not by itself accumulate a field across its own scope** the way a `repeated` select does — inside `each`, the per-element body still writes named fields, and those still merge by name into `data`. Use a `repeated` field if you want one combined array out of the iteration.

---

## Relationship to other behaviors

Accumulation is the *cross-action* counterpart to a single `repeated` select (which collects multiple matches in *one* query). Both end up as arrays; the difference is whether the matches came from one query or were merged from several. For the `select` field options that shape each contribution (`repeated`, `distinct`, `type`, etc.) see [features.md](features.md), and for how the `data` object is rooted while it accumulates see [data-context.md](data-context.md).
