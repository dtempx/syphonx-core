[syphonx-core](../README.md) / WaitFor

# Interface: WaitFor

Polls the DOM until a condition is met or a timeout expires.
Used as a standalone `waitfor` action or as a post-click wait inside [Click](Click.md).
Ignored during offline extraction — only runs in online (browser) mode.

Specify either `query` or `select` to define the condition:
- `query` — waits for a CSS/jQuery/XPath selector to match (and optionally match a text `pattern`).
- `select` — waits for one or more internal boolean selects to become truthy.

If `when` is also specified, it is evaluated first; the query/select check
only runs when `when` is truthy.

**`Example`**

```ts
// Standalone waitfor action: wait up to 5s for an `h1` to appear.
// Appends a `waitfor-timeout` error and halts if it never appears.
{
  "waitfor": {
    "query": [["h1"]],
    "required": true,
    "timeout": 5
  }
}
```

**`Example`**

```ts
// Post-click waitfor: after clicking a link, wait for `h1` to appear
// before continuing to the next action.
{
  "click": {
    "query": [["a"]],
    "waitfor": { "query": [["h1"]] }
  }
}
```

**`Example`**

```ts
// Select-based waitfor: after scrolling to the bottom of an infinite-scroll
// page, wait (up to 2s) for the image count to grow before continuing.
// A timeout here is silently ignored (required is false/omitted), allowing
// the loop to break naturally via the `break` action.
{
  "waitfor": {
    "select": [
      {
        "name": "_more",
        "type": "boolean",
        "query": [["img.image-grid__image", ["size"], ["filter", "{ value > _size }"]]]
      }
    ],
    "timeout": 2
  }
}
```

**`Example`**

```ts
// `on` option: wait until all query stages match before continuing.
// With `on: "all"`, every stage must match (up to 10s) — here the wait
// passes only once both `.header` and `.footer` are present.
{
  "waitfor": {
    "query": [[".header"], [".footer"]],
    "on": "all",
    "timeout": 10
  }
}
```

**`Example`**

```ts
// `on` option: wait for a loading spinner to disappear before continuing.
// `on: "none"` inverts the check, so the wait passes once the selector no
// longer matches (up to 10s). Useful for waiting on an element to be removed.
{
  "waitfor": {
    "query": [[".loading-spinner"]],
    "on": "none",
    "timeout": 10
  }
}
```

**`Example`**

```ts
// `pattern` option: wait until a status element's text matches a regex.
// Polling continues until `#status` both matches and its text contains
// "Complete". Halts with a `waitfor-timeout` error if it never does.
{
  "waitfor": {
    "query": [["#status"]],
    "pattern": "Complete",
    "required": true,
    "timeout": 10
  }
}
```

**`Example`**

```ts
// `when` option: only wait when a condition is truthy. Here the wait for
// `.results` is skipped entirely unless a `search` param was supplied.
{
  "waitfor": {
    "query": [[".results"]],
    "when": "{params.search}",
    "timeout": 5
  }
}
```

**`Example`**

```ts
// Per-select waitfor flag: each select polls the DOM until its element
// appears, using the template-level timeout. A `waitfor-timeout` error
// (code `"waitfor-timeout"`, key matching the select name) is recorded for
// any element that never appears within the timeout.
{
  "select": [
    { "name": "a1", "waitfor": true, "query": [["#a1"]] },
    { "name": "a2", "waitfor": true, "query": [["#a2"]] }
  ]
}
```

## Table of contents

### Properties

- [name](WaitFor.md#name)
- [on](WaitFor.md#on)
- [pattern](WaitFor.md#pattern)
- [query](WaitFor.md#query)
- [required](WaitFor.md#required)
- [select](WaitFor.md#select)
- [timeout](WaitFor.md#timeout)
- [when](WaitFor.md#when)

## Properties

### name

• `Optional` **name**: `string`

Optional label used in log output (e.g. `WAITFOR myCondition`).

#### Defined in

[package/public/WaitFor.ts:117](https://github.com/dtempx/syphonx-core/blob/main/package/public/WaitFor.ts#L117)

___

### on

• `Optional` **on**: [`SelectOn`](../README.md#selecton)

Controls how multiple query stages or selects are aggregated.
`"any"` (default) — passes as soon as at least one stage/select matches.
`"all"` — requires every stage/select to match before continuing.

#### Defined in

[package/public/WaitFor.ts:138](https://github.com/dtempx/syphonx-core/blob/main/package/public/WaitFor.ts#L138)

___

### pattern

• `Optional` **pattern**: `string`

A regular expression pattern the matched text must satisfy.
Only applies when `query` is specified. Polling continues until both
the selector matches and the extracted text satisfies the pattern.

#### Defined in

[package/public/WaitFor.ts:152](https://github.com/dtempx/syphonx-core/blob/main/package/public/WaitFor.ts#L152)

___

### query

• `Optional` **query**: [`SelectQuery`](../README.md#selectquery)[]

One or more selector queries to poll until a match is found.
Combined with `on` to control whether any or all stages must match.
Optionally filtered by `pattern` for text content matching.

#### Defined in

[package/public/WaitFor.ts:124](https://github.com/dtempx/syphonx-core/blob/main/package/public/WaitFor.ts#L124)

___

### required

• `Optional` **required**: `boolean`

When `true`, a `waitfor-timeout` error is appended and processing halts
if the timeout expires without the condition being met.
When `false` (default), a timeout is silently ignored.

#### Defined in

[package/public/WaitFor.ts:159](https://github.com/dtempx/syphonx-core/blob/main/package/public/WaitFor.ts#L159)

___

### select

• `Optional` **select**: [`Select`](Select.md)[]

One or more internal boolean selects to poll until truthy.
Each select must be internal (name starting with `_`), boolean, and non-repeated.
Combined with `on` to control whether any or all must be satisfied.

#### Defined in

[package/public/WaitFor.ts:131](https://github.com/dtempx/syphonx-core/blob/main/package/public/WaitFor.ts#L131)

___

### timeout

• `Optional` **timeout**: `number`

Maximum time in seconds to poll before giving up.
Defaults to the template-level timeout when not specified.
If `required` is `true` and the timeout expires, a `waitfor-timeout` error is appended.

#### Defined in

[package/public/WaitFor.ts:145](https://github.com/dtempx/syphonx-core/blob/main/package/public/WaitFor.ts#L145)

___

### when

• `Optional` **when**: `string`

Expression that controls whether this wait executes.
When specified, `when` is evaluated first; the `query` or `select`
condition is only polled if `when` is truthy. When `when` is falsy
the action is skipped entirely.

#### Defined in

[package/public/WaitFor.ts:167](https://github.com/dtempx/syphonx-core/blob/main/package/public/WaitFor.ts#L167)
