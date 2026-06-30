# Value Post-Processing

A `select` field can specify both a `query` and a `value`. When it does, the two run **in sequence**: the `query` executes first to pull a raw result out of the DOM, and then the `value` formula runs against that result to clean, reshape, or transform it. This is **value post-processing** — the `value` formula acts as a post-processing step layered on top of the query.

```json
{ "name": "upper", "query": [["h1"]], "value": "{value.toUpperCase()}" }
```

If the page contains `<h1>Example Domain</h1>`, this extracts `"Example Domain"` from the DOM, then the formula uppercases it, yielding `"EXAMPLE DOMAIN"`.

---

## How it works

Inside a `select`, a field is resolved in a fixed order (see [`controller.ts`](../package/controller.ts), the `select` method):

1. **`query`** runs first. Its result becomes the field's working value.
2. **`value`** runs next, *only if* it is defined. The query's result is passed into the formula as the special variable `value`. Whatever the formula returns **replaces** the query result.
3. **Type coercion** (`type`, `repeated`) is applied last, to the value the formula returned.

```js
// simplified from controller.ts
if (select.query)
    item = this.selectResolveSelector(select, item);                 // 1. query first
if (select.value !== undefined)
    item = this.selectResolveValue(select, { data, value: item?.value }); // 2. then value
// selectResolveValue then coerces the result to select.type      // 3. coercion last
```

The key consequence: **inside a post-processing `value` formula, `value` refers to what the query just produced.** This is what distinguishes post-processing from a standalone `value` (where there is no preceding query and `value` is undefined).

---

## With and without a query

The `value` property has two distinct modes depending on whether a `query` is also present:

| Configuration | Behavior | `value` variable in the formula |
|---------------|----------|---------------------------------|
| `value` only | The formula **is** the source of the result (computed/static value) | `undefined` (nothing was queried) |
| `query` + `value` | The query produces a result, the formula **post-processes** it | the query's result |

**Standalone value** (no query) — the formula produces the result outright:

```json
{ "name": "source", "value": "manual" }
{ "name": "full", "value": "{`${data.first} ${data.last}`}" }
{ "name": "pageUrl", "value": "{url}" }
```

**Post-processing value** (with query) — the formula transforms what was extracted:

```json
{ "name": "upper", "query": [["h1"]], "value": "{value.toUpperCase()}" }
```

---

## Examples from the test suite

**Uppercasing extracted text** — `test/value/1.ts`:

```json
{ "name": "a5", "query": [["div"]], "value": "{value.toUpperCase()}" }
```
The comment in the test says it plainly: `// value executes after query`. With `<div>lorum</div>`, the result is `"LORUM"`.

**Inverting a boolean presence check** — `test/boolean/1.ts`:

```json
{ "name": "a1v", "type": "boolean", "query": [["#a1"]], "value": "{ !value }" }
```
The query yields `true` because `#a1` exists; the formula flips it to `false`; then `type: "boolean"` coercion is applied to the formula's result. (Note this is the post-processing path — distinct from the `negate` option, which inverts the query result directly without a formula.)

**Filtering across multiple parsed JSON blobs** — `test/json/3.ts`:

```json
{
    "query": [["script[type='application/ld+json']", ["json"]]],
    "all": true,
    "value": "{value.find(obj => obj.b !== undefined)}"
}
```
The query parses every `ld+json` script into an array (`all: true`); the formula then post-processes that array, selecting the first object that has a `b` property — yielding `{ "b": 2 }`.

---

## Scope available to a post-processing formula

A post-processing `value` formula is an ordinary dynamic formula and has the full formula scope available, in particular:

- **`value`** — the result of the preceding `query` (the defining feature of post-processing)
- **`data`** — the accumulated output object, rooted at the top level (see [data-context.md](data-context.md))
- **`url`**, **`params`** — current page URL and template parameters
- internal state variables (names prefixed with `_`) — see [internal-state-variables.md](internal-state-variables.md)

This means post-processing can combine the freshly queried `value` with anything already extracted:

```json
{ "name": "label", "query": [[".price"]], "value": "{`${data.currency} ${value}`}" }
```

---

## Common patterns

**Normalize a date string to ISO:**
```json
{ "name": "lastmod", "query": [[".sectionDate"]], "value": "{value ? new Date(value).toISOString() : undefined}" }
```

**Trim or clean whitespace after extraction:**
```json
{ "query": [[".raw"]], "value": "{value && value.trim()}" }
```

**Fix a protocol on an extracted URL:**
```json
{ "query": [["a", ["attr", "href"]]], "value": "{value.startsWith('http://') ? `https://${value.slice(7)}` : value}" }
```

**Pick or reshape from a queried array:**
```json
{ "query": [[".tag"]], "repeated": true, "value": "{value.filter(v => v.length > 2)}" }
```

---

## Array post-processing and wrapped values

When the field is also `repeated`, `value` is the whole captured array. If that array is a list of **captured objects** (a nested `type: "object"` select), each row is still in the engine's internal wrapper form — so a captured `href` is read as `obj.href.value`, not `obj.href`. This is a common stumbling block; it has its own note: [value-wrappers.md](value-wrappers.md).

---

## Relationship to other formula uses

Post-processing is one of several places dynamic formulas appear. The defining trait here is the ordering — **query first, formula second, coercion last** — and the presence of a meaningful `value` variable. For the broader catalog of formula features, see [dynamic-formulas.md](dynamic-formulas.md).
