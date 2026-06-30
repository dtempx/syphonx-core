# Unions

`union` is a `select` field operator that holds an **array of alternative sub-definitions** for a single output field. Instead of one `query`, the field offers several candidates; the engine evaluates each one and **merges** their results into the same field.

```json
{
    "select": [
        {
            "name": "content",
            "type": "string",
            "repeated": true,
            "union": [
                { "query": [["div > p"]] },
                { "query": [["ul > li"]] }
            ]
        }
    ]
}
```

Here `content` is gathered from two different DOM regions — the `<p>` paragraphs and the `<li>` list items — and the two result sets are combined into one array. This is the worked example in [`test/union/1.ts`](../test/union/1.ts).

A `select` field must supply exactly **one** of `query`, `union`, or `value`. `union` is the multi-strategy alternative to a plain `query`: it lets one field draw from more than one source without splitting it into multiple `select` actions.

---

## How a union is evaluated

The engine walks the union array **in order**. For each entry:

1. If the entry has a `when` guard, it is evaluated; a falsy guard **skips** that entry entirely.
2. Otherwise the entry runs — its `query` (and optional nested `select`), `pivot`, or `value` — exactly as a standalone field would.
3. The entry's result is **merged** into the field's running result.

The crucial point: a union does **not** stop at the first entry that matches. *Every* entry whose guard passes contributes, and the contributions are combined with the same `merge` helper that powers [field accumulation](accumulation.md). The merge rule depends on the field's type:

| Field shape | What merging does across union entries |
|-------------|----------------------------------------|
| `repeated: true` (array) | **Concatenated** — every entry's matches are appended, in array order |
| `type: "object"` | Merged **key by key**, recursively |
| scalar (string / number / boolean) | **Latest non-empty wins** — the last entry that produces a value supersedes earlier ones |

So whether a union *accumulates everything* or *resolves to a single value* is decided by the field's type and `when` guards — not by a separate flag. See [accumulation.md](accumulation.md) for the full merge table.

### Property inheritance

Each union entry **inherits** the parent field's properties (`name`, `type`, `repeated`, `format`, etc.) and may **override** any of them individually. You normally set `type`/`repeated`/`format` once on the parent and let every entry pick it up, specifying only the differing `query` (and `select`, `when`, or `value`) per entry.

---

## Pattern 1 — Multi-variant extraction (the dominant use)

By far the most common use: each entry is a complete extractor (`query`, optionally with a nested `select`) aimed at the **same logical field but a different DOM layout or a different region of the page**. There are two natural sub-modes, both driven entirely by the merge rules above.

### 1a. Merge multiple regions (repeated field)

When the field is `repeated`, every matching entry's results are concatenated into one flat list. Use this when a single logical field is genuinely **spread across several distinct sections** that should all be collected together.

```json
{
    "name": "items",
    "type": "object",
    "repeated": true,
    "union": [
        { "query": [["section.primary .item"]],   "select": [ /* … */ ] },
        { "query": [["section.secondary .item"]], "select": [ /* … */ ] },
        { "query": [["aside .item"]],             "select": [ /* … */ ] }
    ]
}
```

All three sections contribute; `data.items` ends up holding every item from every region, in the order the entries are listed. This is the cross-region counterpart to [accumulation](accumulation.md) (which merges the *same field across several actions*) — a union merges several sources **within one field definition**.

### 1b. Alternative layouts (effectively first-usable)

When a site ships a handful of **inconsistent page templates** and you want whichever one a given page happens to use, list each layout's selector as an entry. Since unmatched selectors contribute nothing, the field ends up with whatever the matching layout produced:

```json
{
    "name": "summary",
    "type": "string",
    "union": [
        { "query": [["article .summary"]] },
        { "query": [[".content > p:first-child"]] },
        { "query": [["meta[name='description']", ["attr", "content"]]] }
    ]
}
```

For a **scalar** field, remember the merge rule is *latest non-empty wins* — so if more than one layout selector matches on the same page, the **last** matching entry takes precedence, not the first. Order the entries accordingly, or add [`when` guards](dynamic-formulas.md) so that at most one entry ever fires (see Pattern 2).

### Tagging each item with its source variant

The 0-based index of the current union entry is exposed to formulas as the variable **`union`**. This lets you stamp each result with the layout/region it came from — handy for debugging which entry fired:

```json
{
    "name": "a1",
    "repeated": true,
    "union": [
        { "query": [["div > p", ["map", "{`${value}-${union}`}"]]] },
        { "query": [["ul > li", ["map", "{`${value}-${union}`}"]]] }
    ]
}
```

Given paragraphs `abc/def/ghi` and list items `111/222/333`, this yields
`["abc-0","def-0","ghi-0","111-1","222-1","333-1"]` — the first entry's matches tagged `-0`, the second's tagged `-1`. (From [`test/union/1.ts`](../test/union/1.ts).)

---

## Pattern 2 — Conditional value switch (`when` / `value`)

A union can also act as an **if/else that emits a value** rather than a selector. Each entry is a guard clause: a `when` condition paired with a `value`. Because the entries are guarded, only the matching one(s) emit, so the field resolves to a single value — a switch/case.

```json
{
    "name": "status",
    "type": "string",
    "union": [
        { "when": "{!_not_found}", "value": "ok" },
        { "when": "{_not_found}",  "value": "not-found" }
    ]
}
```

This evaluates each branch's `when` and emits the matching branch's `value`. A typical use is flagging whether a page actually loaded, paired with a downstream guard that aborts extraction on dead pages:

```json
{ "break": { "when": "{_not_found}" } }
```

The `value` formulas have the full [dynamic-formula](dynamic-formulas.md) scope (`value`, `data`, `url`, `params`, `_`-prefixed variables). Make the branches mutually exclusive so exactly one fires; if more than one `when` passes, the scalar merge rule (latest non-empty wins) decides the result.

---

## Single-entry unions

A union with just **one** entry is functionally identical to a plain `query`/`select`:

```json
{ "name": "items", "repeated": true, "union": [ { "query": [[".item"]] } ] }
```

It is sometimes written this way deliberately, as a placeholder, so that additional layout variants can be slotted in later without restructuring the field into a union.

---

## Tips and gotchas

- **Pick the field type first.** `repeated: true` accumulates *all* matching entries (concatenate); a scalar field keeps only the *latest non-empty*. The same union array behaves very differently depending on this one property.
- **Scalar fallback is last-wins, not first-wins.** If several entries can match the same page and you want a strict priority order, either order entries so the preferred one is last, or guard the others with `when`.
- **Set shared options on the parent.** `type`, `repeated`, and `format` are inherited; specify them once and override only where an entry differs.
- **`when` skips, it doesn't stop.** A failing guard skips just that entry; later entries are still evaluated. There is no "stop after first match" — model that with mutually exclusive guards.
- **`union` is the entry index.** Available inside any formula in an entry (e.g. a `map`), 0-based, to tag results with their source.
- **Duplicates accumulate.** Merging across regions can produce duplicate rows; add [`distinct: true`](features.md) to collapse them.

---

## Related

- [accumulation.md](accumulation.md) — the `merge` semantics that combine union entries (and the cross-action counterpart to a within-field union).
- [dynamic-formulas.md](dynamic-formulas.md) — the `{…}` formula scope used in `when` and `value` entries, and the variables (including `union`) available inside them.
- [features.md](features.md) — the full set of `select` field options (`repeated`, `type`, `format`, `distinct`, …) that union entries inherit.
- [data-context.md](data-context.md) — how the `data` object is rooted while results merge in.
