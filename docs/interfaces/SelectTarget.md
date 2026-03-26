[syphonx-core](../README.md) / [Exports](../modules.md) / SelectTarget

# Interface: SelectTarget

Base interface for selection targets, defining how data is queried and
extracted from DOM elements. Used as the building block for [Select](Select.md)
and as the element type for [Select.union](Select.md#union).

## Hierarchy

- **`SelectTarget`**

  ↳ [`Select`](Select.md)

## Table of contents

### Properties

- [all](SelectTarget.md#all)
- [collate](SelectTarget.md#collate)
- [comment](SelectTarget.md#comment)
- [context](SelectTarget.md#context)
- [distinct](SelectTarget.md#distinct)
- [format](SelectTarget.md#format)
- [hits](SelectTarget.md#hits)
- [limit](SelectTarget.md#limit)
- [negate](SelectTarget.md#negate)
- [pattern](SelectTarget.md#pattern)
- [pivot](SelectTarget.md#pivot)
- [query](SelectTarget.md#query)
- [removeNulls](SelectTarget.md#removenulls)
- [select](SelectTarget.md#select)
- [value](SelectTarget.md#value)
- [waitfor](SelectTarget.md#waitfor)
- [when](SelectTarget.md#when)

## Properties

### all

• `Optional` **all**: `boolean`

When `true`, includes results from all query stages instead of stopping
at the first stage that matches. Default is `false`.

Also affects boolean aggregation: when `true`, all values are AND'ed
together; when `false`, values are OR'ed.

**`Example`**

```ts
// all: false (default) — stops at the first stage that matches
{ name: "p1", all: false, query: [["h1"], ["h2"]] }
// Given <h1>abc</h1><h1>def</h1><h2>ghi</h2>
// => { p1: "abc\ndef" }  (only h1 results)
```

**`Example`**

```ts
// all: true — collects results from every matching stage
{ name: "p2", all: true, query: [["h1"], ["h2"]] }
// Given <h1>abc</h1><h1>def</h1><h2>ghi</h2><h2>jkl</h2>
// => { p2: "abc\ndef\nghi\njkl" }
```

#### Defined in

[package/public/Select.ts:112](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L112)

___

### collate

• `Optional` **collate**: `boolean`

When `true`, processes the selector as a single unit rather than
iterating over each matched node individually. Forces `all` to `true`
for any nested sub-selects so all node values are included.

#### Defined in

[package/public/Select.ts:162](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L162)

___

### comment

• `Optional` **comment**: `string`

An optional comment for documentation purposes. Not used at runtime.

#### Defined in

[package/public/Select.ts:165](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L165)

___

### context

• `Optional` **context**: ``null`` \| `number`

Sets the DOM context depth for the selector query.
Default is `1` (inherits from the immediate parent context).
Specify `null` for global context (the entire document).

#### Defined in

[package/public/Select.ts:172](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L172)

___

### distinct

• `Optional` **distinct**: `boolean`

When `true`, removes duplicate values from array results.
Uses reference equality (`indexOf`) for deduplication.

**`Example`**

```ts
// Without distinct: duplicates are preserved
{ name: "tags", repeated: true, query: [["li"]] }
// Given <li>alpha</li><li>beta</li><li>alpha</li>
// => { tags: ["alpha", "beta", "alpha"] }
```

**`Example`**

```ts
// With distinct: duplicates are removed
{ name: "tags", repeated: true, distinct: true, query: [["li"]] }
// Given <li>alpha</li><li>beta</li><li>alpha</li>
// => { tags: ["alpha", "beta"] }
```

#### Defined in

[package/public/Select.ts:190](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L190)

___

### format

• `Optional` **format**: [`SelectFormat`](../modules.md#selectformat)

Controls how string values are formatted.
Default is `"multiline"` when `type` is `"string"`.
The `"href"` format resolves relative URLs against the page origin.

**`Example`**

```ts
// "singleline" collapses whitespace into single spaces
{ name: "text", query: [["p"]], format: "singleline" }
// Given <p>\n  AAA\n  BBB\n</p>  =>  { text: "AAA BBB" }
```

**`Example`**

```ts
// "multiline" (default) preserves line breaks
{ name: "text", query: [["p"]], format: "multiline" }
// Given <p>\n  AAA\n  BBB\n</p>  =>  { text: "AAA\nBBB" }
```

**`Example`**

```ts
// "href" resolves relative URLs against the page origin
{ name: "url", query: [["a", ["attr", "href"]]], format: "href" }
// Given <a href="/path"> on https://example.com  =>  { url: "https://example.com/path" }
```

#### Defined in

[package/public/Select.ts:148](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L148)

___

### hits

• `Optional` **hits**: ``null`` \| `number`

**`Deprecated`**

Use `all` instead.
Limits the number of query stages that produce hits before stopping.
Default is the total number of stages. Specify `null` for unlimited.

#### Defined in

[package/public/Select.ts:119](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L119)

___

### limit

• `Optional` **limit**: ``null`` \| `number`

Limits the number of nodes returned by the query.
Default is `1` when `repeated` is `false` and `all` is `false`,
otherwise unlimited. Specify `null` to explicitly force unlimited nodes.

#### Defined in

[package/public/Select.ts:126](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L126)

___

### negate

• `Optional` **negate**: `boolean`

When `true`, negates a boolean result. For arrays of booleans,
each individual value is negated.

#### Defined in

[package/public/Select.ts:196](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L196)

___

### pattern

• `Optional` **pattern**: `string`

A regular expression pattern used to validate string results.
When set, `result.valid` is `true` only if every extracted string
matches the pattern. Only applies when `type` is `"string"`.

#### Defined in

[package/public/Select.ts:155](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L155)

___

### pivot

• `Optional` **pivot**: [`SelectTarget`](SelectTarget.md)

**`Deprecated`**

Use jQuery traversal selectors instead.
Runs a sub-selection against each node matched by `query`, pivoting
the context so each node is processed individually.

#### Defined in

[package/public/Select.ts:43](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L43)

___

### query

• `Optional` **query**: [`SelectQuery`](../modules.md#selectquery)[]

One or more selector queries to locate DOM elements.
Each entry is a "stage" — by default only the first stage that matches
is used; set `all` to `true` to include results from every stage.

Query format: `[["css-selector", ["method", "arg1"], ["method2"]]]`
where methods chain jQuery operations (e.g. `["attr", "href"]`, `["split", ","]`).
XPath selectors use a `/` or `xpath:` prefix.

**`Example`**

```ts
// Simple CSS selector
{ name: "title", query: [["h1"]] }
// => { title: "Example Domain" }
```

**`Example`**

```ts
// Chained operations: extract an attribute then resolve as an absolute URL
{ name: "link", query: [["a", ["attr", "href"]]], format: "href" }
// => { link: "https://www.example.com/foo" }
```

**`Example`**

```ts
// Multiple fallback stages — first match wins (all: false by default)
{ name: "heading", query: [["h1"], ["h2"], ["h3"]] }
```

**`Example`**

```ts
// XPath selector
{ name: "price", query: [["//span[@class='price']"]] }
```

#### Defined in

[package/public/Select.ts:36](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L36)

___

### removeNulls

• `Optional` **removeNulls**: `boolean`

When `true`, filters out `null` values from array results.

#### Defined in

[package/public/Select.ts:201](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L201)

___

### select

• `Optional` **select**: [`Select`](Select.md)[]

Nested selections to execute within the context of nodes matched by
`query`. Produces structured objects when combined with `type: "object"`.

**`Example`**

```ts
// Extract a structured object from a DOM subtree
{
  name: "product",
  type: "object",
  query: [["div.product"]],
  select: [
    { name: "name",  query: [[".name"]] },
    { name: "price", query: [[".price"]], type: "number" }
  ]
}
// => { product: { name: "Widget", price: 9.99 } }
```

#### Defined in

[package/public/Select.ts:62](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L62)

___

### value

• `Optional` **value**: `unknown`

A literal value or expression to use as the selection result.
If both `query` and `value` are specified, `query` executes first
and its result is available to the `value` expression as `value`.

Expressions are wrapped in `{}` and have access to: `data` (accumulated
output), `value` (result of the preceding `query`), `url`, and any
template variables prefixed with `_`.

**`Example`**

```ts
// Literal string value
{ name: "source", value: "manual" }
// => { source: "manual" }
```

**`Example`**

```ts
// Expression combining previously extracted fields
{ name: "full", value: "{`${data.first} ${data.last}`}" }
```

**`Example`**

```ts
// Post-process a query result (query runs first, then value)
{ name: "upper", query: [["h1"]], value: "{value.toUpperCase()}" }
// => { upper: "EXAMPLE DOMAIN" }
```

**`Example`**

```ts
// Inject the page URL
{ name: "pageUrl", value: "{url}" }
```

#### Defined in

[package/public/Select.ts:91](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L91)

___

### waitfor

• `Optional` **waitfor**: `boolean`

When `true`, waits for elements matching `query` to appear in the DOM
before proceeding. Only effective in online (browser) mode.
If the wait times out and `required` is `true`, returns a timeout error.

#### Defined in

[package/public/Select.ts:208](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L208)

___

### when

• `Optional` **when**: `string`

A condition that must be met for the selection to execute.
Actions with an unmet condition are logged as SKIPPED.
Actions that cannot execute in offline mode are logged as BYPASSED.

#### Defined in

[package/public/Select.ts:215](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L215)
