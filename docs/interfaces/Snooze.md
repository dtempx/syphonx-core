[syphonx-core](../README.md) / [Exports](../modules.md) / Snooze

# Interface: Snooze

Pauses execution for a specified duration. Only takes effect in online
(browser) mode — in offline mode the snooze is logged but skipped entirely,
adding zero delay (see `offline/1` test).

The sleep duration is derived from `interval`: when two values are given,
the engine sleeps for a random duration between them (capped by the
template's max timeout via `maxTimeout`). Elapsed snooze time is tracked
in `metrics.snooze`.

Commonly used inside [Repeat](Repeat.md) loops to throttle pagination — adding
a small delay between page transitions to avoid overwhelming the server
or triggering rate-limiting.

The `snooze` action also accepts shorthand forms via [SnoozeAction](../modules.md#snoozeaction):
a bare number (`{ "snooze": 60 }`), a single-element tuple
(`{ "snooze": [60] }`), or a two-element tuple (`{ "snooze": [1, 2] }`).
These are equivalent to setting `interval` on the full `Snooze` object.

`SnoozeInterval` is a separate compact tuple used on [Click](Click.md) to add
a pause before/after a click — see [SnoozeInterval](../modules.md#snoozeinterval) and
[SnoozeMode](../modules.md#snoozemode) for that usage.

**`Example`**

```ts
// Shorthand: pause for 60 seconds (single-element tuple)
{ "snooze": [60] }
```

**`Example`**

```ts
// Shorthand: pause for a bare number of seconds
{ "snooze": 60 }
```

**`Example`**

```ts
// Shorthand: pause for a random duration between 1 and 2 seconds
{ "snooze": [1, 2] }
```

**`Example`**

```ts
// offline/1: snooze is ignored in offline mode — no delay is added.
// The log will contain "SNOOZE 60s IGNORED".
{
  "actions": [
    { "snooze": [60] },
    { "select": [{ "name": "p1", "query": [["p"]] }] }
  ]
}
```

**`Example`**

```ts
// repeat/1 (online): 0.25s snooze between pagination clicks to
// throttle requests while collecting titles across pages.
{
  "repeat": {
    "limit": 10,
    "actions": [
      { "select": [{ "name": "titles", "type": "string", "repeated": true, "query": [["h1"]] }] },
      { "snooze": [0.25] },
      { "break": { "query": [["#next"]], "on": "none" } },
      { "click": { "query": [["#next"]] } },
      { "yield": { "params": { "waitUntil": "domcontentloaded" } } }
    ]
  }
}
```

## Table of contents

### Properties

- [interval](Snooze.md#interval)
- [name](Snooze.md#name)
- [when](Snooze.md#when)

## Properties

### interval

• **interval**: [`number`, `number`] \| [`number`]

The sleep duration in seconds. When a single value is given (`[n]`),
the engine sleeps for exactly `n` seconds. When two values are given
(`[min, max]`), the engine sleeps for a random duration between `min`
and `max` (capped by the template's max timeout).

#### Defined in

[package/public/Snooze.ts:101](https://github.com/dtempx/syphonx-core/blob/main/package/public/Snooze.ts#L101)

___

### name

• `Optional` **name**: `string`

Optional label used in log output (e.g. `SNOOZE myDelay`).

#### Defined in

[package/public/Snooze.ts:93](https://github.com/dtempx/syphonx-core/blob/main/package/public/Snooze.ts#L93)

___

### when

• `Optional` **when**: `string`

Optional condition that gates this snooze. When present, the expression
is evaluated before sleeping. If it is falsy, the snooze is skipped and
the skipped-steps metric is incremented. See [When](../modules.md#when) for expression
syntax details.

#### Defined in

[package/public/Snooze.ts:109](https://github.com/dtempx/syphonx-core/blob/main/package/public/Snooze.ts#L109)
