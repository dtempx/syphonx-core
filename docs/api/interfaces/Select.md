[syphonx-core](../README.md) / Select

# Interface: Select

Defines a named data extraction from the DOM. Extends [SelectTarget](SelectTarget.md)
with output-shaping fields (`name`, `repeated`, `type`) and the ability
to merge multiple extraction strategies via `union`.

**`Example`**

```ts
// Basic named string extraction
{ name: "title", query: [["h1"]] }
// => { title: "Example Domain" }
```

**`Example`**

```ts
// Unnamed (projected) extraction — result returned directly, not keyed
{ query: [["h1"]] }
// => "Example Domain"
```

**`Example`**

```ts
// Boolean type check
{ name: "isDiv", type: "boolean", query: [["div", ["is", "div"]]] }
// => { isDiv: true }
```

**`Example`**

```ts
// Repeated (array) extraction
{ name: "items", repeated: true, query: [["li"]] }
// Given <li>one</li><li>two</li><li>three</li>
// => { items: ["one", "two", "three"] }
```

**`Example`**

```ts
// Nested object extraction
{
  name: "product",
  type: "object",
  query: [["div"]],
  select: [
    { name: "name", query: [[".name"]] },
    { name: "type", query: [[".type"]] }
  ]
}
// => { product: { name: "apple", type: "fruit" } }
```

**`Example`**

```ts
// Template variable (name starts with "_") — stored in vars, not output data
{ name: "_category", query: [["meta[name='category']", ["attr", "content"]]] }
// Stored in state.vars._category, accessible in later expressions via {_category}
```

**`Example`**

```ts
// Union — merge results from multiple DOM regions into one field
{
  name: "all_items",
  repeated: true,
  union: [
    { query: [["div > p"]] },
    { query: [["ul > li"]] }
  ]
}
// => { all_items: ["para1", "para2", "item1", "item2"] }
```

## Hierarchy

- [`SelectTarget`](SelectTarget.md)

  ↳ **`Select`**

## Table of contents

### Properties

- [all](Select.md#all)
- [collate](Select.md#collate)
- [comment](Select.md#comment)
- [context](Select.md#context)
- [distinct](Select.md#distinct)
- [format](Select.md#format)
- [hits](Select.md#hits)
- [limit](Select.md#limit)
- [name](Select.md#name)
- [negate](Select.md#negate)
- [pattern](Select.md#pattern)
- [pivot](Select.md#pivot)
- [query](Select.md#query)
- [removeNulls](Select.md#removenulls)
- [repeated](Select.md#repeated)
- [required](Select.md#required)
- [select](Select.md#select)
- [type](Select.md#type)
- [union](Select.md#union)
- [value](Select.md#value)
- [waitfor](Select.md#waitfor)
- [when](Select.md#when)

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

#### Inherited from

[SelectTarget](SelectTarget.md).[all](SelectTarget.md#all)

#### Defined in

[package/public/Select.ts:112](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L112)

___

### collate

• `Optional` **collate**: `boolean`

When `true`, processes the selector as a single unit rather than
iterating over each matched node individually. Forces `all` to `true`
for any nested sub-selects so all node values are included.

#### Inherited from

[SelectTarget](SelectTarget.md).[collate](SelectTarget.md#collate)

#### Defined in

[package/public/Select.ts:162](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L162)

___

### comment

• `Optional` **comment**: `string`

An optional comment for documentation purposes. Not used at runtime.

#### Inherited from

[SelectTarget](SelectTarget.md).[comment](SelectTarget.md#comment)

#### Defined in

[package/public/Select.ts:165](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L165)

___

### context

• `Optional` **context**: ``null`` \| `number`

Sets the DOM context depth for the selector query.
Default is `1` (inherits from the immediate parent context).
Specify `null` for global context (the entire document).

#### Inherited from

[SelectTarget](SelectTarget.md).[context](SelectTarget.md#context)

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

#### Inherited from

[SelectTarget](SelectTarget.md).[distinct](SelectTarget.md#distinct)

#### Defined in

[package/public/Select.ts:190](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L190)

___

### format

• `Optional` **format**: [`SelectFormat`](../README.md#selectformat)

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

#### Inherited from

[SelectTarget](SelectTarget.md).[format](SelectTarget.md#format)

#### Defined in

[package/public/Select.ts:148](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L148)

___

### hits

• `Optional` **hits**: ``null`` \| `number`

**`Deprecated`**

Use `all` instead.
Limits the number of query stages that produce hits before stopping.
Default is the total number of stages. Specify `null` for unlimited.

#### Inherited from

[SelectTarget](SelectTarget.md).[hits](SelectTarget.md#hits)

#### Defined in

[package/public/Select.ts:119](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L119)

___

### limit

• `Optional` **limit**: ``null`` \| `number`

Limits the number of nodes returned by the query.
Default is `1` when `repeated` is `false` and `all` is `false`,
otherwise unlimited. Specify `null` to explicitly force unlimited nodes.

#### Inherited from

[SelectTarget](SelectTarget.md).[limit](SelectTarget.md#limit)

#### Defined in

[package/public/Select.ts:126](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L126)

___

### name

• `Optional` **name**: `string`

The property name in the output data object. If omitted, the value is
projected (returned directly instead of assigned to a key).
Names starting with `_` are stored as template variables instead of output data.

**`Example`**

```ts
// Named: result is placed at data.title
{ name: "title", query: [["h1"]] }
```

**`Example`**

```ts
// Unnamed (projected): result becomes the top-level data value
{ query: [["h1"]] }
```

**`Example`**

```ts
// Template variable: stored in vars._sku for use in later expressions
{ name: "_sku", query: [["span.sku"]] }
```

#### Defined in

[package/public/Select.ts:292](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L292)

___

### negate

• `Optional` **negate**: `boolean`

When `true`, negates a boolean result. For arrays of booleans,
each individual value is negated.

#### Inherited from

[SelectTarget](SelectTarget.md).[negate](SelectTarget.md#negate)

#### Defined in

[package/public/Select.ts:196](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L196)

___

### pattern

• `Optional` **pattern**: `string`

A regular expression pattern used to validate string results.
When set, `result.valid` is `true` only if every extracted string
matches the pattern. Only applies when `type` is `"string"`.

#### Inherited from

[SelectTarget](SelectTarget.md).[pattern](SelectTarget.md#pattern)

#### Defined in

[package/public/Select.ts:155](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L155)

___

### pivot

• `Optional` **pivot**: [`SelectTarget`](SelectTarget.md)

**`Deprecated`**

Use jQuery traversal selectors instead.
Runs a sub-selection against each node matched by `query`, pivoting
the context so each node is processed individually.

#### Inherited from

[SelectTarget](SelectTarget.md).[pivot](SelectTarget.md#pivot)

#### Defined in

[package/public/Select.ts:43](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L43)

___

### query

• `Optional` **query**: [`SelectQuery`](../README.md#selectquery)[]

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

#### Inherited from

[SelectTarget](SelectTarget.md).[query](SelectTarget.md#query)

#### Defined in

[package/public/Select.ts:36](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L36)

___

### removeNulls

• `Optional` **removeNulls**: `boolean`

When `true`, filters out `null` values from array results.

#### Inherited from

[SelectTarget](SelectTarget.md).[removeNulls](SelectTarget.md#removenulls)

#### Defined in

[package/public/Select.ts:201](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L201)

___

### repeated

• `Optional` **repeated**: `boolean`

When `true`, the result is always returned as an array.
When `false` (default), strings are newline-concatenated (or space-concatenated
for `"singleline"` format), booleans are OR'ed together, and other types
return only the first value.

**`Example`**

```ts
// repeated: true — every matched node becomes an array element
{ name: "titles", repeated: true, query: [["h1"]] }
// Given <h1>First</h1><h1>Second</h1>
// => { titles: ["First", "Second"] }
```

**`Example`**

```ts
// repeated: false (default) — multiple nodes are joined
{ name: "title", repeated: false, query: [["h1"]] }
// Given <h1>First</h1><h1>Second</h1>
// => { title: "First\nSecond" }
```

#### Defined in

[package/public/Select.ts:312](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L312)

___

### required

• `Optional` **required**: `boolean`

When `true`, appends a `select-required` error if no value is found
for this selector. Default is `false`.

**`Example`**

```ts
// Missing required field — adds a "select-required" error and sets ok: false
{ name: "price", required: true, query: [["span.price"]] }
// If no <span class="price"> exists:
// errors: [{ code: "select-required", key: "price", message: "Required select 'price' not found" }]
```

**`Example`**

```ts
// Optional field — missing value silently produces null, no error
{ name: "subtitle", required: false, query: [["h2"]] }
// If no <h2> exists:  => { subtitle: null }
```

#### Defined in

[package/public/Select.ts:329](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L329)

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

#### Inherited from

[SelectTarget](SelectTarget.md).[select](SelectTarget.md#select)

#### Defined in

[package/public/Select.ts:62](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L62)

___

### type

• `Optional` **type**: [`SelectType`](../README.md#selecttype)

The expected data type of the extracted value.
Default is `"string"`, except when `select` (sub-selections) is present,
in which case the default is `"object"`.

Values are coerced to the target type: strings are formatted according to
`format`, numbers are parsed via `parseFloat`, and booleans treat non-empty
truthy values as `true`.

**`Example`**

```ts
// type: "string" (default)
{ name: "label", type: "string", query: [["h1"]] }
// => { label: "Hello" }
```

**`Example`**

```ts
// type: "number" — parsed with parseFloat
{ name: "count", type: "number", query: [["span.count"]] }
// Given <span class="count">42</span>  =>  { count: 42 }
```

**`Example`**

```ts
// type: "boolean" — truthy/falsy coercion
{ name: "active", type: "boolean", query: [["div", ["is", "div"]]] }
// => { active: true }
```

**`Example`**

```ts
// type: "object" — used with nested select to produce a structured object
{ name: "item", type: "object", query: [["div"]], select: [{ name: "x", query: [["span"]] }] }
// => { item: { x: "value" } }
```

#### Defined in

[package/public/Select.ts:360](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L360)

___

### union

• `Optional` **union**: [`SelectTarget`](SelectTarget.md)[]

An array of alternative selection targets that are evaluated in sequence
and whose results are merged. Useful for combining data from different
parts of the DOM into a single output field.

Each entry in the union inherits properties from the parent `Select`
and can override them individually.

**`Example`**

```ts
// Merge paragraphs and list items into a single repeated field
{
  name: "content",
  type: "string",
  repeated: true,
  union: [
    { query: [["div > p"]] },
    { query: [["ul > li"]] }
  ]
}
// => { content: ["para1", "para2", "item1", "item2"] }
```

#### Defined in

[package/public/Select.ts:383](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L383)

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

#### Inherited from

[SelectTarget](SelectTarget.md).[value](SelectTarget.md#value)

#### Defined in

[package/public/Select.ts:91](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L91)

___

### waitfor

• `Optional` **waitfor**: `boolean`

When `true`, waits for elements matching `query` to appear in the DOM
before proceeding. Only effective in online (browser) mode.
If the wait times out and `required` is `true`, returns a timeout error.

#### Inherited from

[SelectTarget](SelectTarget.md).[waitfor](SelectTarget.md#waitfor)

#### Defined in

[package/public/Select.ts:208](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L208)

___

### when

• `Optional` **when**: `string`

A condition that must be met for the selection to execute.
Actions with an unmet condition are logged as SKIPPED.
Actions that cannot execute in offline mode are logged as BYPASSED.

#### Inherited from

[SelectTarget](SelectTarget.md).[when](SelectTarget.md#when)

#### Defined in

[package/public/Select.ts:215](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L215)
