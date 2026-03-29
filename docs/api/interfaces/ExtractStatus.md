[syphonx-core](../README.md) / ExtractStatus

# Interface: ExtractStatus

A status snapshot sent during extraction to report progress on the current action.

Created by the controller at the start of each action step and broadcast via
`window.postMessage` in online (browser) mode when `debug` is `true`. The Chrome
DevTools extension listens for these messages (keyed by `"extract-status"`) to
display real-time step progress to the user.

## Table of contents

### Properties

- [action](ExtractStatus.md#action)
- [name](ExtractStatus.md#name)
- [of](ExtractStatus.md#of)
- [step](ExtractStatus.md#step)
- [timeout](ExtractStatus.md#timeout)

## Properties

### action

• **action**: `string`

The action type name for the current step (e.g. `"select"`, `"click"`,
`"snooze"`, `"navigate"`, `"waitfor"`). Derived from the first key of
the action object.

#### Defined in

[package/public/ExtractStatus.ts:29](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractStatus.ts#L29)

___

### name

• `Optional` **name**: `string`

The optional user-defined name of the action, if one was specified in the
template. Useful for identifying specific actions in debug output.

#### Defined in

[package/public/ExtractStatus.ts:35](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractStatus.ts#L35)

___

### of

• **of**: `string`

The total number of steps at the current nesting level, formatted as a
dot-separated path matching the depth of `step` (e.g. `"5"`, `"5.3"`).
Together with `step`, enables progress display such as "step 2 of 5".

#### Defined in

[package/public/ExtractStatus.ts:22](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractStatus.ts#L22)

___

### step

• **step**: `string`

The current step number within the action list, formatted as a dot-separated
path for nested action groups (e.g. `"1"`, `"2.3"`). Set by the controller
after `runExtractStatus` returns, before the message is posted.

#### Defined in

[package/public/ExtractStatus.ts:15](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractStatus.ts#L15)

___

### timeout

• `Optional` **timeout**: `number`

The estimated maximum duration of the action in seconds, when applicable.
Computed from the action's configuration:
- For `snooze`: the upper bound of the snooze interval.
- For `waitfor`: the `timeout` value (defaults to the engine's default timeout).
- For `click`: the sum of the snooze upper bound and waitfor timeout, if present.

#### Defined in

[package/public/ExtractStatus.ts:44](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractStatus.ts#L44)
