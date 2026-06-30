# The `data` Context in Formulas

Every dynamic formula (`{...}`) is evaluated with a `data` variable in scope. `data` is the **accumulated output object** — the same structure you get back as `result.data` at the end of a run. It lets a formula read values that have already been extracted and use them to compute new ones.

```json
{
    "select": [
        { "name": "a1", "query": [["div"]] },
        { "name": "a2", "value": "ipsum" },
        { "name": "a3", "value": "{`${data.a1} ${data.a2}`}" }
    ]
}
```

Here `a3` resolves to `"lorum ipsum"` by reading the two fields selected before it. You reference any prior result simply by the name it was given in its `select`.

---

## `data` is rooted at the top level

The most important thing to understand is **where `data` is rooted**. It is *not* scoped to whatever object you happen to be building. `data` always refers to the **top-level root** of the output — the same object whether you read it from a plain top-level field, from inside a nested object, or from inside a repeated sub-array.

That means from anywhere in a template you can reach "up and over" to any top-level field:

```json
{
    "name": "items",
    "type": "object",
    "repeated": true,
    "query": [[".item"]],
    "select": [
        { "name": "letter", "query": [[".L"]] },
        { "name": "label", "value": "{`${data.heading}: ${data.letter}`}" }
    ]
}
```

Even though `label` is computed while building each element of the `items` array, `data.heading` reaches all the way back to the top-level `heading` field, while `data.letter` reads the sibling within the current array element. There is a single root, and every formula sees it.

> **How it works internally.** When a formula is evaluated, the engine builds its `data` scope as `merge(state.data, localData)` (see [`controller.ts`](../package/controller.ts), the `evaluate` method). `state.data` is the one top-level output root; `localData` is the object currently being assembled at the present nesting level. The two are merged, with the local level layered on top — so the root is always reachable, and the fields nearest to you take precedence.

---

## What is visible, and when

Because `data` is assembled from "the committed root" plus "the level you're currently building," visibility follows two rules. Both come down to **evaluation order** — a formula can only see what was produced *before* it ran.

### 1. Earlier siblings at the same level

Within a single `select` block, fields are evaluated top to bottom, and each one is added to `data` as it completes. So a later field can read an earlier sibling, but **not** one defined after it.

```json
{
    "select": [
        { "name": "first", "value": "DEFINED-FIRST" },
        { "name": "second", "value": "{data.first}" }
    ]
}
```

`second` resolves to `"DEFINED-FIRST"`. If you reverse the order, the reference yields `undefined` (and the field is dropped) because the dependency hasn't been computed yet.

**This is why it is often useful to define a dependent `select` *before* the one that consumes it** — the producer must run first for its value to be present in `data` when the consumer's formula evaluates.

### 2. Results from earlier actions

The top-level root (`state.data`) is updated **after each action completes**, not field-by-field across actions. So a value extracted by one action is visible to formulas in any *later* action:

```json
[
    { "select": [{ "name": "category", "query": [["h1"]] }] },
    { "select": [{ "name": "tag", "value": "{data.category.toLowerCase()}" }] }
]
```

This also has a subtle consequence worth calling out:

> A nested sub-array **cannot** reach a parent-level sibling that belongs to the **same, still-running action**. At that moment the parent field has not yet been committed to the root, and the nested level's local overlay only contains the nested object's own fields — so it is visible in neither place. If you need a value to be readable from *inside* a nested or repeated selection, produce it in an **earlier action** (so it is committed to the root) rather than as a sibling in the same action.

In practice: top-level values from prior actions are always reachable from deep inside later selections; values from the *current* action are only reachable across siblings at the *same* nesting level.

---

## Common uses

**Combining fields into a derived value:**
```json
{ "name": "fullName", "value": "{`${data.first} ${data.last}`}" }
```

**Deduplicating against an already-collected array:**
```json
{ "value": "{value.filter(obj => !data.professionals.map(({ href }) => href).includes(obj.href.value))}" }
```

**Cross-referencing inside a transform** (the `data` root is available to transform formulas too):
```json
{ "query": ["h4", ["replaceText", "{`${data.h1} ${value} ${data.h2}`}"]] }
```

**Guarding an action on extracted state:**
```json
{ "select": [{ "name": "price", "query": [[".price"]], "when": "{data.type === 'product'}" }] }
```

---

## Relationship to other formula variables

`data` is one of several variables the engine projects into a formula's scope, alongside:

- `value` — the result of the immediately preceding query or operation
- `url`, `params` — the current page URL and template parameters
- `parent.index` / `parent.value` — loop context inside `each`
- internal state variables (names prefixed with `_`)

A useful contrast: `data` is **rooted but order-dependent** (you reach the top-level output, but only see what has already been produced), whereas **internal state variables are flat and always-present** — each `_var` is projected at the top level of every formula by its bare name, regardless of nesting or action boundaries. When you need a value that must be readable from anywhere at any time, an internal variable is usually the cleaner choice. See [internal-state-variables.md](internal-state-variables.md).

For the full catalog of formula features, see [dynamic-formulas.md](dynamic-formulas.md).
