[syphonx-core](../README.md) / Each

# Interface: Each

Iterates over a set of DOM elements matched by a `query`, executing a
sequence of `actions` once per element with that element set as the active
context.

For each matched element the controller:
1. Pushes a new context whose root is that single element.
2. Runs all `actions` against that context.
3. Pops the context before moving to the next element.

An inner action may return a `"break"` signal (e.g. from a `break` action)
to exit the loop early.

**Difference from `repeat`:** `each` iterates over a *fixed set of DOM
elements* determined by `query` — the number of iterations equals the number
of matched nodes. `repeat` loops over the same actions up to a configurable
`limit` count without tying iterations to specific DOM nodes; it is typically
used for open-ended pagination or polling scenarios where the stopping
condition is determined dynamically at runtime.

**`Example`**

```ts
// each/1 (offline): iterate <li> elements and correlate each with its
// sibling <p> using parent.index and parent.value from the loop context.
// context: null → selectors inside actions resolve against the document root.
{
  "each": {
    "query": [["ul > li"]],
    "context": null,
    "actions": [
      {
        "select": [
          {
            "name": "a1",
            "type": "string",
            "repeated": true,
            "query": [["{`p:eq(${parent.index})`}", ["map", "{`${parent.index}:${parent.value}:${value}`}"]]]
          }
        ]
      }
    ]
  }
}
// Result: { a1: ["0:news:ABC", "1:weather:NBC", "2:sports:CBS"] }
```

**`Example`**

```ts
// each/2 (online): click each <option> in a <select>, then read a
// JavaScript-rendered value from the page after each click.
{
  "each": {
    "query": [["select > option"]],
    "actions": [
      { "click": { "query": [["."]]] } },
      {
        "select": [
          { "name": "a1", "type": "string", "repeated": true, "context": null, "query": [["#output"]] }
        ]
      }
    ]
  }
}
// Result: { a1: ["first", "second", "third"] }
```

## Table of contents

### Properties

- [actions](Each.md#actions)
- [context](Each.md#context)
- [name](Each.md#name)
- [query](Each.md#query)
- [when](Each.md#when)

## Properties

### actions

• **actions**: [`Action`](../README.md#action)[]

Actions to execute for each matched element. The active context is set
to that element before the actions run, so relative selectors inside
those actions resolve against it. A `break` action inside `actions`
stops iteration early.

#### Defined in

[package/public/Each.ts:92](https://github.com/dtempx/syphonx-core/blob/main/package/public/Each.ts#L92)

___

### context

• `Optional` **context**: ``null`` \| `number`

Controls which DOM context is used when evaluating `query` and when
setting up the per-element context passed to `actions`.

- `undefined` (omitted) — inherits the current (parent) context.
  Selectors are scoped to whatever element the surrounding action
  established as the root. This is the default.
- `null` — uses the global document root, regardless of any enclosing
  context. Useful when the `each` query or the inner actions need to
  escape the current scope and address the full page.
- `number` (1-based ancestor depth) — inherits the context from that
  many levels up the context stack, allowing a nested `each` to resolve
  selectors relative to a specific outer scope.

#### Defined in

[package/public/Each.ts:108](https://github.com/dtempx/syphonx-core/blob/main/package/public/Each.ts#L108)

___

### name

• `Optional` **name**: `string`

Optional label used in debug logs and metrics.
Appears in log entries as `EACH <name>`.

#### Defined in

[package/public/Each.ts:72](https://github.com/dtempx/syphonx-core/blob/main/package/public/Each.ts#L72)

___

### query

• **query**: [`SelectQuery`](../README.md#selectquery)[]

One or more selector stages that identify the elements to iterate over.
Each stage is a `SelectQuery` (a CSS selector, jQuery expression, or
`{xpath}…` XPath expression, optionally followed by chained method
calls). The engine evaluates the stages in order and uses the first one
that returns at least one node.

All matched elements are collected up-front; the loop runs exactly
once per matched node.

#### Defined in

[package/public/Each.ts:84](https://github.com/dtempx/syphonx-core/blob/main/package/public/Each.ts#L84)

___

### when

• `Optional` **when**: `string`

Optional condition that gates the entire `each` loop. When present, the
expression is evaluated before the query runs. If it is falsy the action
is skipped entirely and the skipped-steps metric is incremented. See
[When](../README.md#when) for expression syntax details.

#### Defined in

[package/public/Each.ts:116](https://github.com/dtempx/syphonx-core/blob/main/package/public/Each.ts#L116)
