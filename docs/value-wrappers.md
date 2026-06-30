# Wrapped Values in Array Post-Processing

This note covers a quirk that surprises people the first time they write a `value` formula on a **repeated** select: the array you receive as `value` is *not* the same clean shape you see in the final output. Each captured row is still wrapped in the engine's internal structure, so a captured `href` is read as `obj.href.value` — **not** `obj.href`.

If you have ever wondered why one formula mixes `data.professionals` (plain) with `obj.href.value` (with a `.value` suffix) in the same line, this is why.

---

## The two shapes: wrapped vs. unwrapped

Internally, every extracted result is a **wrapper object** — a `DataItem` of the form `{ nodes, key, value }`, where `value` holds the actual extracted data and `nodes`/`key` are bookkeeping the engine uses. These wrappers are an implementation detail you normally never see, because the output is **unwrapped** before you get it: each wrapper is recursively collapsed to its `.value`. That is why the final result is clean:

```jsonc
// final output — fully unwrapped
[
    { "name": "Jane", "href": "https://x.com/people/jane" },
    { "name": "John", "href": "https://x.com/people/john" }
]
```

But a post-processing `value` formula runs **before** that unwrapping happens, and it does not receive the unwrapped form. The asymmetry is the whole story:

| In a formula | Shape | How you read a field |
|--------------|-------|----------------------|
| `data` | **unwrapped** | `data.professionals[0].href` → `"https://…"` |
| `value` (on a repeated object select) | **wrapped** | `value[0].href.value` → `"https://…"` |

So within a single formula, `data.…` gives you plain values, while `value` gives you wrapper-laden rows where each property carries a `.value` sub-field.

> **Why the difference?** When the engine builds a formula's scope, it passes `data` through `unwrap()` but passes `value` straight through as the raw captured result (see [`controller.ts`](../package/controller.ts) — `data: unwrap(merge(...))` versus `value: item?.value`). `data` is a convenience snapshot; `value` is the live thing currently being built, still in wrapper form.

---

## What `value` actually looks like

Given a repeated object select like:

```json
{
    "name": "people",
    "type": "object",
    "repeated": true,
    "query": [[".row"]],
    "select": [
        { "name": "name", "query": [["a"], ["text"]] },
        { "name": "href", "query": [["a", ["attr", "href"]]] }
    ],
    "value": "{ /* post-processing runs here */ }"
}
```

…the `value` your formula receives is an array whose elements look like this at runtime:

```jsonc
[
    {
        "name": { "nodes": [...], "key": "people.name", "value": "Jane" },
        "href": { "nodes": [...], "key": "people.href", "value": "https://x.com/people/jane" }
    },
    ...
]
```

Each property (`name`, `href`) is a `DataItem` wrapper. To reach the string, you go through `.value`: `obj.href.value`, `obj.name.value`. The output you eventually get back is the unwrapped version of whatever your formula returns — so the wrappers disappear again afterward.

---

## The canonical examples

**Drop a landing/index row by inspecting the captured href:**

```json
{ "value": "{value.filter(obj => !obj.href.value.endsWith('/people/'))}" }
```

`value` is the captured array; `obj.href.value` reads the URL out of each wrapped row; the filtered array is returned and unwrapped into the output.

**Dedupe against another already-captured list** — this is the case that shows both shapes side by side:

```json
{ "value": "{value.filter(obj => !data.professionals.map(({ href }) => href).includes(obj.href.value))}" }
```

Read carefully:

- `data.professionals.map(({ href }) => href)` — `data` is **unwrapped**, so `href` destructures directly to the URL string.
- `obj.href.value` — `obj` comes from `value`, which is **wrapped**, so the URL lives under `.value`.

Same URL, two different access paths, in one expression — purely because one comes from `data` and the other from `value`.

**Find a single matching object across parsed JSON** (from `test/json/3.ts`) — note that when the captured values are plain (here, parsed JSON objects rather than wrapped select rows) there is no `.value` to peel:

```json
{ "query": [["script[type='application/ld+json']", ["json"]]], "all": true,
  "value": "{value.find(obj => obj.b !== undefined)}" }
```

---

## When does the `.value` suffix apply?

The `.value` sub-field appears only when the array elements are **captured objects** — i.e. a `repeated` select with a nested `select` (`type: "object"`). In that case each row is a record of `DataItem` wrappers.

- **Repeated object select** → `value[i]` is `{ field: { value, nodes, key } }` → use `obj.field.value`.
- **Repeated scalar select** (no nested `select`) → `value[i]` is already a plain value (e.g. a string) → use it directly, no `.value`.

A quick way to remember it: if the rows have *named fields*, those fields are wrapped; if the rows are *bare values*, they are not.

---

## Practical guidance

- Inside an array post-processing formula, reach into captured fields with `obj.<field>.value`.
- When you need the *same* value in unwrapped form elsewhere in the formula, read it from `data` instead — but remember `data` only reflects results already committed by earlier actions and earlier siblings (see [data-context.md](data-context.md)).
- Don't try to return the wrappers yourself — return plain values or plain objects; the engine unwraps your formula's result into the final output automatically.

---

## Related

- [value-postprocessing.md](value-postprocessing.md) — the general mechanism of running a `value` formula after a `query`; this note is the repeated-array special case.
- [data-context.md](data-context.md) — how the (unwrapped) `data` root is resolved and what is visible when.
- [dynamic-formulas.md](dynamic-formulas.md) — the full catalog of formula features.
