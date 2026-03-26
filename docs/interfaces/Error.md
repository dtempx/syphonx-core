[syphonx-core](../README.md) / [Exports](../modules.md) / Error

# Interface: Error

Defines a conditional error action that can halt or flag extraction based on
a DOM query or a `when` expression.

An error action is triggered one of two ways:
1. **Query-based** — a `query` is evaluated as a boolean. By default, the
   error fires when the query result is `false` (element not found). Set
   `negate` to `true` to invert this, firing the error when the element
   *is* found.
2. **Expression-based** — a `when` expression is evaluated against the
   current template variables. The error fires when the expression is truthy.

If neither `query` nor `when` is specified, the error action is skipped.

The `level` controls severity and retry behavior:
- `0` — non-retryable (fatal). Stops processing by default.
- `1` (default) — retryable. Processing continues by default.
- `2+` — retryable with higher severity. Processing stops by default
  (same stop logic as level 0 when `stop` is not explicitly set).

The `message` field supports formula expressions wrapped in `{}` that are
evaluated at runtime, giving access to template variables and extracted data.
If omitted, a default message is used based on the error `code`.

**`Example`**

```ts
// errors/3: Expression-based error with level 1 (retryable, processing continues)
// Given HTML: <h1>xyz</h1><p>abc</p>
{
  actions: [
    { select: [{ name: "_h1", query: [["h1"]] }] },
    { error: { when: "{_h1 === 'xyz'}", message: "{`${_h1} error`}", level: 1 } },
    { select: [{ name: "_p", query: [["p"]] }] }
  ]
}
// => errors: [{ code: "app-error", message: "xyz error", level: 1 }]
// => _h1: "xyz", _p: "abc" (processing continued past the error)
```

**`Example`**

```ts
// errors/4: Expression-based error with level 0 (non-retryable, stops processing)
// Given HTML: <h1>xyz</h1><p>abc</p>
{
  actions: [
    { select: [{ name: "_h1", query: [["h1"]] }] },
    { error: { when: "{_h1 === 'xyz'}", message: "{`${_h1} error`}", level: 0 } },
    { select: [{ name: "_p", query: [["p"]] }] }
  ]
}
// => errors: [{ code: "app-error", message: "xyz error", level: 0 }]
// => _h1: "xyz", _p: undefined (processing stopped at the error)
```

**`Example`**

```ts
// errors/5: Query-based error — fires when query result is false (element not found)
// Given HTML: <h1>xyz</h1><p>abc</p>
{
  actions: [
    { error: { query: [["h1"]], message: "h1 not found", level: 2 } },
    { error: { query: [["h2"]], message: "h2 not found", level: 2 } }
  ]
}
// => errors: [{ code: "app-error", message: "h2 not found", level: 2 }]
// (h1 exists so the first error does not fire; h2 is missing so the second fires)
```

## Table of contents

### Properties

- [code](Error.md#code)
- [level](Error.md#level)
- [message](Error.md#message)
- [name](Error.md#name)
- [negate](Error.md#negate)
- [query](Error.md#query)
- [stop](Error.md#stop)
- [when](Error.md#when)

## Properties

### code

• `Optional` **code**: [`ExtractErrorCode`](../modules.md#extracterrorcode)

The error code recorded when the error fires.
Default is `"app-error"`. Each code has a corresponding default message
in `errorCodeMessageMap` that is used when `message` is omitted.

**`Default`**

```ts
"app-error"
```

#### Defined in

[package/public/Error.ts:82](https://github.com/dtempx/syphonx-core/blob/main/package/public/Error.ts#L82)

___

### level

• `Optional` **level**: `number`

The error severity level that controls retry behavior and whether
processing stops.

- `0` — non-retryable. Processing stops by default (unless `stop` is
  explicitly `false`).
- `1` (default) — retryable. Processing continues by default.
- `2+` — retryable with higher severity. Processing stops by default
  when `stop` is not explicitly set.

The level is recorded on the resulting [ExtractError](ExtractError.md) and can be
inspected by the host to decide whether to retry the extraction.

**`Default`**

```ts
1
```

#### Defined in

[package/public/Error.ts:120](https://github.com/dtempx/syphonx-core/blob/main/package/public/Error.ts#L120)

___

### message

• **message**: `string`

The error message recorded when the error fires.
Supports formula expressions wrapped in `{}` that are evaluated at
runtime against template variables and extracted data
(e.g. `"{`${_h1} error`}"`).

If omitted, a default message is derived from the `code`:
- `"app-error"` → `"An application defined error occured."`
- `"click-timeout"` → `"Timeout waiting for click result."`
- etc.

**`Example`**

```ts
// Static message
{ error: { query: [["h1"]], message: "Missing heading" } }
```

**`Example`**

```ts
// Dynamic message using a template expression
{ error: { when: "{_h1 === 'xyz'}", message: "{`${_h1} error`}" } }
```

#### Defined in

[package/public/Error.ts:103](https://github.com/dtempx/syphonx-core/blob/main/package/public/Error.ts#L103)

___

### name

• `Optional` **name**: `string`

An optional label for this error action.
Used for documentation and identification purposes only; not included
in the resulting [ExtractError](ExtractError.md).

#### Defined in

[package/public/Error.ts:73](https://github.com/dtempx/syphonx-core/blob/main/package/public/Error.ts#L73)

___

### negate

• `Optional` **negate**: `boolean`

Inverts the query result logic.
When `false` (default), the error fires if the query result is `false`
(element not found).
When `true`, the error fires if the query result is `true`
(element found).

Only applicable when `query` is set.

**`Example`**

```ts
// Error fires when <div class="blocked"> IS found on the page
{ error: { query: [["div.blocked"]], negate: true, message: "Page is blocked" } }
```

#### Defined in

[package/public/Error.ts:173](https://github.com/dtempx/syphonx-core/blob/main/package/public/Error.ts#L173)

___

### query

• `Optional` **query**: [`SelectQuery`](../modules.md#selectquery)[]

A boolean query that conditionally triggers the error.
The query is evaluated with `type: "boolean"`. By default, the error
fires when the query result is `false` (i.e. the target element is
*not* found). Use `negate` to invert this behavior.

Mutually exclusive with `when` — if `query` is set, `when` is ignored.

**`Example`**

```ts
// Fire error when <h2> is NOT found
{ error: { query: [["h2"]], message: "h2 not found" } }
```

**`Example`**

```ts
// Fire error when <h1> IS found (using negate)
{ error: { query: [["h1"]], message: "h1 should not exist", negate: true } }
```

#### Defined in

[package/public/Error.ts:158](https://github.com/dtempx/syphonx-core/blob/main/package/public/Error.ts#L158)

___

### stop

• `Optional` **stop**: `boolean`

Whether to halt all further action processing when this error fires.

When `true`, throws a `"STOP"` signal that ends extraction immediately.
When `false`, processing continues with the next action.
When `undefined` (default), stop behavior is inferred from `level`:
processing stops if `level` is `0`, otherwise it continues.

**`Example`**

```ts
// Level 0 stops by default
{ error: { when: "{!_ok}", message: "fatal", level: 0 } }
// => processing stops
```

**`Example`**

```ts
// Level 1 continues by default, but stop: true overrides
{ error: { when: "{!_ok}", message: "bad state", level: 1, stop: true } }
// => processing stops despite level 1
```

#### Defined in

[package/public/Error.ts:140](https://github.com/dtempx/syphonx-core/blob/main/package/public/Error.ts#L140)

___

### when

• `Optional` **when**: `string`

A conditional expression that controls whether this error action
executes. Evaluated against the current template variables.
The error fires when the expression is truthy.

Only used when `query` is not set — if `query` is present, `when` is
ignored and the query result determines whether the error fires.

**`Example`**

```ts
// Fire error only when a previously extracted value matches a condition
{ error: { when: "{_status === 'blocked'}", message: "Page is blocked" } }
```

#### Defined in

[package/public/Error.ts:187](https://github.com/dtempx/syphonx-core/blob/main/package/public/Error.ts#L187)
