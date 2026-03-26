[syphonx-core](../README.md) / [Exports](../modules.md) / YieldState

# Interface: YieldState

Serializable snapshot of the engine's execution position at the point of a
yield. Passed between the engine (running inside the browser) and the host
(Playwright/Node.js) so the engine can resume from exactly where it stopped.

## Table of contents

### Properties

- [level](YieldState.md#level)
- [params](YieldState.md#params)
- [result](YieldState.md#result)
- [step](YieldState.md#step)

## Properties

### level

• `Optional` **level**: `number`

Nesting depth within `each` loops at the point of the yield.
Used by the host to restore the correct loop context on re-entry.

#### Defined in

[package/public/Yield.ts:177](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L177)

___

### params

• `Optional` **params**: [`YieldParams`](YieldParams.md)

The host-side action to perform before re-entering the engine.
Mirrors [YieldParams](YieldParams.md) — present when an action (click, navigate,
etc.) needs the host to do work; absent for a bare settle-and-re-enter yield.

#### Defined in

[package/public/Yield.ts:171](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L171)

___

### result

• `Optional` **result**: `unknown`

Optional value the host can inject back into the engine on re-entry
(e.g. the result of a locator operation). Available to subsequent actions
via template variable references.

#### Defined in

[package/public/Yield.ts:184](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L184)

___

### step

• **step**: `number`[]

The action-path index array that identifies the yield point within the
action tree. On re-entry, the engine uses this to skip already-completed
actions and resume from the step immediately after the yield.

#### Defined in

[package/public/Yield.ts:164](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L164)
