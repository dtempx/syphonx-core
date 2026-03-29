[syphonx-core](../README.md) / Click

# Interface: Click

Simulates a user click on a DOM element matched by a CSS/jQuery/XPath selector.
Only executes in online (browser) mode — ignored during offline extraction.
For `<select>/<option>` elements, sets the select value and dispatches `change`
and `input` events instead of calling `.click()` directly.

## Table of contents

### Properties

- [name](Click.md#name)
- [query](Click.md#query)
- [required](Click.md#required)
- [retry](Click.md#retry)
- [snooze](Click.md#snooze)
- [waitUntil](Click.md#waituntil)
- [waitfor](Click.md#waitfor)
- [when](Click.md#when)
- [yield](Click.md#yield)

## Properties

### name

• `Optional` **name**: `string`

Optional label used in log output (e.g. `CLICK myButton`).

#### Defined in

[package/public/Click.ts:15](https://github.com/dtempx/syphonx-core/blob/main/package/public/Click.ts#L15)

___

### query

• **query**: [`SelectQuery`](../README.md#selectquery)[]

One or more selector queries to locate the target element. The first matched node is clicked.

#### Defined in

[package/public/Click.ts:18](https://github.com/dtempx/syphonx-core/blob/main/package/public/Click.ts#L18)

___

### required

• `Optional` **required**: `boolean`

When `true`, appends a `click-required` error and halts processing
if no element is found matching `query`.

#### Defined in

[package/public/Click.ts:38](https://github.com/dtempx/syphonx-core/blob/main/package/public/Click.ts#L38)

___

### retry

• `Optional` **retry**: `number`

**`Deprecated`**

Not implemented.

#### Defined in

[package/public/Click.ts:41](https://github.com/dtempx/syphonx-core/blob/main/package/public/Click.ts#L41)

___

### snooze

• `Optional` **snooze**: [`SnoozeInterval`](../README.md#snoozeinterval)

Pause (in seconds) to insert before and/or after the click.
Tuple form: `[seconds]`, `[min, max]`, or `[min, max, mode]`
where `mode` is `"before"` (default), `"after"`, or `"before-and-after"`.

#### Defined in

[package/public/Click.ts:32](https://github.com/dtempx/syphonx-core/blob/main/package/public/Click.ts#L32)

___

### waitUntil

• `Optional` **waitUntil**: [`DocumentLoadState`](../README.md#documentloadstate)

The navigation/load state the Playwright host should wait for after
a yielded click (e.g. `"load"`, `"domcontentloaded"`, `"networkidle"`).
Only relevant when `yield` is `true`.

#### Defined in

[package/public/Click.ts:56](https://github.com/dtempx/syphonx-core/blob/main/package/public/Click.ts#L56)

___

### waitfor

• `Optional` **waitfor**: [`WaitFor`](WaitFor.md)

Condition to wait for after the click before continuing.
Skipped entirely if no nodes are matched by `query`.
If the wait times out, a `click-timeout` error is appended.

#### Defined in

[package/public/Click.ts:25](https://github.com/dtempx/syphonx-core/blob/main/package/public/Click.ts#L25)

___

### when

• `Optional` **when**: `string`

Expression that controls whether this action executes. Skips the click when falsy.

#### Defined in

[package/public/Click.ts:59](https://github.com/dtempx/syphonx-core/blob/main/package/public/Click.ts#L59)

___

### yield

• `Optional` **yield**: `boolean`

When `true`, yields control back to the Playwright host after clicking
instead of continuing execution inline. Useful when the click triggers
a navigation or full-page update that must be handled by the host.
Use `waitUntil` to control the navigation state the host waits for.

#### Defined in

[package/public/Click.ts:49](https://github.com/dtempx/syphonx-core/blob/main/package/public/Click.ts#L49)
