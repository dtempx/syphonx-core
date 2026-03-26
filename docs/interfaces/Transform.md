[syphonx-core](../README.md) / [Exports](../modules.md) / Transform

# Interface: Transform

A single DOM mutation step within a `transform` action.

A `transform` action accepts an array of `Transform` objects, each of which
selects DOM elements and applies in-place mutations using jQuery operations
such as `replaceWith`, `replaceText`, `replaceHTML`, `addClass`, `attr`,
`wrap`, `map`, and `filter`. Unlike a `select` action — which reads the DOM
and stores data in the result — a `transform` action writes back to the DOM,
reshaping the page's HTML before (or between) data extraction steps.

Each transform step runs in sequence. Errors in a single step are logged and
skipped; subsequent steps continue normally. The number of matched nodes is
logged as `TRANSFORM [name] <selector> -> (N nodes)`.

**Formula expressions:** Mutation operation arguments wrapped in `{...}` are
evaluated as formulas. Inside a formula, `value` holds the current element's
text content (or the result of a prior operation in the chain), and `data`
holds all data extracted so far, allowing transforms to reference previously
selected fields.

**Online-only operations:** The `autopaginate` operator is only available
when running in online (browser/Playwright) mode; it is silently skipped in
offline mode.

**`Example`**

```ts
// transform/1: add a class to h3 elements that end with ':', replace others
// with <p> elements, wrap <a> in a <div>, and add a class to <b>
{
  transform: [
    { query: ["h3", ["map", "{value?.endsWith(':') ? value : undefined}"], ["addClass", "alpha"]] },
    { query: ["h3", ["map", "{!value?.endsWith(':') ? value : undefined}"], ["replaceWith", "{`<p>${value}</p>`}"]] },
    { query: ["a", ["wrap", "<div></div>"]] },
    { query: ["b", ["addClass", "omega"]] }
  ]
}
```

**`Example`**

```ts
// transform/2: replace text/HTML using computed values; access already-
// extracted data via `data`; replace an element using its inner HTML
{
  transform: [
    { query: ["h1", ["replaceText", "{value.split(' ').reduce((sum, t) => sum + parseInt(t), 0)}"]] },
    { query: ["h2", ["replaceHTML", "{'<b>' + value.split(' ').reduce((sum, t) => sum + parseInt(t), 0) + '</b>'}"]] },
    { query: ["h4", ["replaceText", "{`${data.h1} ${value} ${data.h2}`}"]] },
    { query: ["h6", ["html", "inner"], ["replaceWith", "{`<div>${value}</div>`}"]] }
  ]
}
```

**`Example`**

```ts
// transform/5: dynamic class name and attribute value from element text
{
  transform: [
    { query: ["h1", ["addClass", "{value.toLowerCase()}"]] },
    { query: ["h2", ["attr", "id", "{value.toUpperCase()}"]] }
  ]
}
```

**`Example`**

```ts
// transform/6: filter-then-replace — only h3 elements that end with ':'
// are promoted to <h2>; others are left unchanged
{
  transform: [
    { query: ["h3:contains(':')", ["filter", "{value.endsWith(':')}"], ["replaceWith", "{`<h2>${value.replace(':','').trim()}</h2>`}"]] }
  ]
}
```

## Table of contents

### Properties

- [name](Transform.md#name)
- [query](Transform.md#query)
- [when](Transform.md#when)

## Properties

### name

• `Optional` **name**: `string`

Optional label for this transform step.

When provided, the name appears in log output as
`TRANSFORM <name> <selector> -> (N nodes)`, `TRANSFORM <name> SKIPPED`,
or `TRANSFORM <name> ERROR ...`, making it easier to trace individual
steps in multi-transform actions.

**`Example`**

```ts
{ name: "normalize-headings", query: ["h3", ["replaceText", "{value.trim()}"]] }
```

#### Defined in

[package/public/Transform.ts:82](https://github.com/dtempx/syphonx-core/blob/main/package/public/Transform.ts#L82)

___

### query

• **query**: [`SelectQuery`](../modules.md#selectquery)

The selector and chain of mutation operations to apply to matched elements.

Uses the same `SelectQuery` format as `Select.query`, but the operations
are jQuery DOM-mutation methods rather than data-extraction methods.
The first element of the array is the CSS or XPath selector; subsequent
elements are `[method, ...args]` tuples applied in sequence to each
matched node.

**Single query, not an array:** Unlike `Select.query` — which is
`SelectQuery[]` and accepts multiple fallback stages (first match wins)
— this field is a single `SelectQuery`. A transform targets one specific
selector; fallback alternatives are not needed because the intent is a
deliberate, unconditional mutation rather than a best-effort data read.

**Common mutation operations:**
- `["addClass", "cls"]` / `["addClass", "{expr}"]` — add a CSS class (expression allowed)
- `["attr", "name", "value"]` / `["attr", "name", "{expr}"]` — set an attribute
- `["wrap", "<tag></tag>"]` — wrap matched elements with a new parent element
- `["replaceWith", "{expr}"]` — replace the entire element with evaluated HTML
- `["replaceText", "{expr}"]` — replace the element's text content
- `["replaceHTML", "{expr}"]` — replace the element's inner HTML
- `["map", "{expr}"]` — filter/transform the matched set (return `undefined` to drop a node)
- `["filter", "{expr}"]` — keep only elements for which the expression is truthy
- `["html", "inner"]` — read inner HTML into `value` for use in subsequent ops
- `["autopaginate", "next-btn-selector", maxPages?, timeoutSec?, minDelaySec?, maxDelaySec?]`
  — (online only) repeatedly click a "next page" button until no more pages exist

In expression arguments (`{...}`), `value` holds the current element's
text or the result of the preceding operation, and `data` holds all data
extracted by prior `select` actions.

**`Example`**

```ts
// Replace text content of every <li> with its uppercased value
{ query: ["li", ["replaceText", "{value.toUpperCase()}"]] }
```

**`Example`**

```ts
// Read inner HTML, then replace the element using a template literal
{ query: ["div", ["html", "inner"], ["replaceWith", "{`<p>${value.toLowerCase()}</p>`}"]] }
```

**`Example`**

```ts
// Online-only: auto-paginate using a "next" button, up to 10 pages
{ query: [".item", ["autopaginate", ".next-btn", 10]] }
```

#### Defined in

[package/public/Transform.ts:128](https://github.com/dtempx/syphonx-core/blob/main/package/public/Transform.ts#L128)

___

### when

• `Optional` **when**: `string`

An optional condition that controls whether this transform step runs.

When provided, the expression is evaluated at runtime. If the result is
falsy the step is skipped and logged as `TRANSFORM [name] SKIPPED`. When
omitted, the step always runs. See [When](../modules.md#when) for expression syntax.

**`Example`**

```ts
// Only normalize headings when the page is in "list" mode
{ name: "normalize", query: ["h3", ["replaceText", "{value.trim()}"]], when: "{_mode === 'list'}" }
```

#### Defined in

[package/public/Transform.ts:141](https://github.com/dtempx/syphonx-core/blob/main/package/public/Transform.ts#L141)
