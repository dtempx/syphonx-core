# Internal State Variables

SyphonX templates can hold their own working state while extraction is running. Any field whose `name` begins with an underscore (`_`) is an **internal state variable** rather than an output field. These variables exist to carry information *between* actions — a captured value, a counter, a boolean flag — without polluting the final result.

```json
{ "select": [{ "name": "_h1", "query": [["h1"]] }] }
```

This selects the `<h1>` text and stores it as the internal variable `_h1`. It does **not** appear in `data`.

---

## Two special behaviors

Internal state variables differ from ordinary fields in two important ways.

### 1. They are excluded from the final output

A normal select field is written into the extracted `data` object and shows up in the result. An underscore-prefixed field is instead written into a separate `vars` bucket on the extraction state. It lives only for the duration of the run and is never merged into `data`.

```json
{
    "select": [
        { "name": "_ok", "type": "boolean", "query": [["#xyz"]] },
        { "name": "a1", "query": [["#a1"]], "when": "{_ok}" }
    ]
}
```

After this runs:

- `result.data._ok` → `undefined` (not in the output)
- `result.vars._ok` → `true` (available internally)
- `result.data.a1` → the extracted value (a normal output field)

So `_ok` did its job — gating whether `a1` ran — and then disappeared from the result. If you need a value purely to drive logic and never want it in the output, prefix it with `_`.

> Internal variables *are* surfaced on `result.vars` for inspection and debugging, but they are kept out of `result.data`.

### 2. They are always available at the top level of every formula

This is the more subtle behavior, and the more useful one.

When a dynamic formula (`{...}`) is evaluated, several things are placed into the expression's scope: `value`, `data`, `url`, `params`, the current loop context (`index`, `count`), and so on. The catch is that some of these are **context-sensitive** — most importantly `data`. When you are extracting a nested object (`type: "object"`), or iterating with `each`, the `data` visible to a formula refers to the *local* slice you are currently building, not the whole result. So `data.someField` means different things depending on where in the template you are.

Internal state variables are **not** context-sensitive. Every variable in `vars` is spread directly into the top level of the formula scope, by its own name, no matter how deeply nested the action is. `_page_num` is always just `_page_num` — not `data._page_num`, not `parent._page_num`, not `root.data._page_num`. There is no path to walk and no scope to reach across.

In other words: **internal state variables form a single flat namespace that is projected into the top level of every formula's scope.** Wherever you are — inside a nested object, inside an `each` body, inside a `repeat` loop, inside a `when` guard several levels deep — you reference any internal variable by its bare name and get the same value. They behave like globals that are always in scope for expressions, which is exactly why they are the right tool for state that must survive across actions and nesting boundaries.

```json
{
    "name": "product",
    "type": "object",
    "query": [[".product"]],
    "select": [
        { "name": "title", "query": [["h2"]] },
        { "name": "currency", "value": "{_currency}" }
    ]
}
```

Even though this `value` formula runs while building the nested `product` object — where `data` refers only to that local object — `_currency` resolves cleanly to the variable captured earlier at the top level. You never have to think about *where* `_currency` was set relative to *where* it is read.

---

## Common uses

**Conditional guards** — capture a flag once, branch on it later.

```json
{ "select": [{ "name": "_not_found", "type": "boolean", "query": [[".error-page"]] }] }
```
```json
{
    "name": "status",
    "union": [
        { "when": "{!_not_found}", "value": "ok" },
        { "when": "{_not_found}", "value": "not-found" }
    ]
}
```

**Pagination counters** — increment and compare across loop iterations.

```json
{ "break": { "when": "{_page_num >= _page_count}" } },
{ "select": [{ "name": "_page_num", "value": "{_page_num + 1}" }] },
{ "click": { "query": [["{`#resultPageLinks a:contains('${_page_num}')`}"]] } }
```

**Captured-then-referenced values** — pull a value out of the DOM once, reuse it in messages, selectors, or other fields.

```json
{ "select": [{ "name": "_h1", "query": [["h1"]] }] },
{ "error": { "when": "{_h1 === 'xyz'}", "message": "{`${_h1} error`}", "level": 1 } }
```

**Pre-seeded variables** — internal variables can also be supplied as input before the template runs (via the `vars` option), and they flow straight into formulas:

```json
{ "select": [{ "name": "a1", "type": "string", "repeated": true, "value": "{_value}" }] }
```
With `vars: { _value: ["1", "2"] }`, field `a1` resolves to `["1", "2"]`.

---

## Summary

| Aspect | Normal field (`title`) | Internal variable (`_title`) |
|--------|------------------------|------------------------------|
| Stored in | `data` (output) | `vars` (working state) |
| In final result | Yes | No (visible on `result.vars`, not `result.data`) |
| Scope in formulas | Context-sensitive (`data` follows nesting) | Always top-level, same name everywhere |
| Typical purpose | Extracted output | Flags, counters, captured intermediate values |

For the broader set of formula features that internal variables participate in, see [dynamic-formulas.md](dynamic-formulas.md).
