[syphonx-core](../README.md) / [Exports](../modules.md) / Yield

# Interface: Yield

Yields control back to the Playwright host, suspending engine execution until
the host re-enters. Used as a standalone action to pause between steps —
for example, after a separate `click` action that triggers a navigation.
Only executes in online (browser) mode — ignored during offline extraction.

The host resumes extraction from the step immediately following the yield,
passing the updated page state back into the engine via [YieldState](YieldState.md).
Use `params` to instruct the host to perform a specific action (navigate,
reload, screenshot, etc.) before re-entering. When `params` is omitted the
host simply waits for the page to settle before re-entering.

**`Example`**

```ts
// Separate click + yield (online/2a pattern):
{ "click": { "query": [["a"]] } }
{ "yield": {} }
```

## Table of contents

### Properties

- [name](Yield.md#name)
- [params](Yield.md#params)
- [when](Yield.md#when)

## Properties

### name

• `Optional` **name**: `string`

Optional label used in log output (e.g. `YIELD myStep`).

#### Defined in

[package/public/Yield.ts:24](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L24)

___

### params

• `Optional` **params**: [`YieldParams`](YieldParams.md)

Parameters that instruct the host which action to perform before
re-entering the engine. When omitted, the host waits for the page
to settle (approximately 1 second) and then re-enters.

#### Defined in

[package/public/Yield.ts:31](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L31)

___

### when

• `Optional` **when**: `string`

Expression that controls whether this action executes. Skips the yield when falsy.

#### Defined in

[package/public/Yield.ts:34](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L34)
