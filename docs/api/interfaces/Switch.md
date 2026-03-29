[syphonx-core](../README.md) / Switch

# Interface: Switch

A single case within a `switch` action. A `switch` action contains an
ordered array of `Switch` cases. The engine evaluates each case in sequence
and runs the `actions` of the **first** case that matches — all subsequent
cases are skipped (like a `switch` statement with an implicit `break` after
every case).

A case matches when both conditions are satisfied:
1. Its [when](Switch.md#when) expression (if present) evaluates to a truthy value.
2. Its [query](Switch.md#query) (if present) matches at least one DOM element (evaluated
   as a boolean). If `query` is omitted the case is treated as a **default /
   fallback** — it matches unconditionally (assuming `when` passes).

If no case matches, the switch action does nothing and logs
`"SWITCH: NONE SELECTED"`.

**`Example`**

```ts
// switch/1: single case — select content only when an <h1> contains "News"
{
  "switch": [
    {
      "query": [["h1:contains('News')"]],
      "actions": [
        {
          "select": [
            { "name": "content", "query": [["h1 ~ p"]] }
          ]
        }
      ]
    }
  ]
}
// Given <h1>News</h1><p>Lorum ipsum</p>
// Result: { content: "Lorum ipsum" }
```

**`Example`**

```ts
// switch/2: multiple cases — match different page layouts by heading text
{
  "switch": [
    {
      "query": [["h1:contains('News')"]],
      "actions": [
        { "select": [{ "name": "content", "query": [["h1 ~ p"]] }] }
      ]
    },
    {
      "query": [["h1:contains('Weather')"]],
      "actions": [
        { "select": [{ "name": "content", "query": [["h1 ~ b"]] }] }
      ]
    }
  ]
}
// Given <h1>Weather</h1><b>Neque porro</b>
// Result: { content: "Neque porro" }
```

**`Example`**

```ts
// switch/3: default fallback — a case with no query acts as a catch-all
{
  "switch": [
    {
      "query": [["h1:contains('News')"]],
      "actions": [
        { "select": [{ "name": "content", "query": [["h1 ~ p"]] }] }
      ]
    },
    {
      "query": [["h1:contains('Weather')"]],
      "actions": [
        { "select": [{ "name": "content", "query": [["h1 ~ b"]] }] }
      ]
    },
    {
      "actions": [
        { "select": [{ "name": "content", "query": [["h1 ~ i"]] }] }
      ]
    }
  ]
}
// Given <h1>Sports</h1><i>Ipsum quia dolor</i>
// Result: { content: "Ipsum quia dolor" }
```

## Table of contents

### Properties

- [actions](Switch.md#actions)
- [name](Switch.md#name)
- [query](Switch.md#query)
- [when](Switch.md#when)

## Properties

### actions

• **actions**: [`Action`](../README.md#action)[]

Actions to execute when this case is selected. Once a case matches,
its actions are run and all remaining cases are skipped — only the
first matching case in the array executes.

#### Defined in

[package/public/Switch.ts:113](https://github.com/dtempx/syphonx-core/blob/main/package/public/Switch.ts#L113)

___

### name

• `Optional` **name**: `string`

Optional label used in debug logs and metrics.
Appears in log entries as `SWITCH CASE n/N <name>`.

#### Defined in

[package/public/Switch.ts:92](https://github.com/dtempx/syphonx-core/blob/main/package/public/Switch.ts#L92)

___

### query

• `Optional` **query**: [`SelectQuery`](../README.md#selectquery)[]

One or more selector stages evaluated as a **boolean** to determine
whether this case matches. Each stage is a `SelectQuery` (a CSS
selector, jQuery expression, or `{xpath}…` XPath expression, optionally
followed by chained method calls). The engine evaluates the stages in
order and treats the result as `true` if at least one node is matched.

When omitted, the case is treated as a **default / fallback** and
matches unconditionally (provided the [when](Switch.md#when) condition also
passes). Place a query-less case last in the array to act as the
catch-all.

#### Defined in

[package/public/Switch.ts:106](https://github.com/dtempx/syphonx-core/blob/main/package/public/Switch.ts#L106)

___

### when

• `Optional` **when**: `string`

Optional condition that gates this case before the query is evaluated.
When present, the expression is evaluated first. If it is falsy the
case is skipped regardless of the query. See [When](../README.md#when) for
expression syntax details.

#### Defined in

[package/public/Switch.ts:121](https://github.com/dtempx/syphonx-core/blob/main/package/public/Switch.ts#L121)
