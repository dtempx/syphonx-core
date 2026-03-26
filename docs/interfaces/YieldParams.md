[syphonx-core](../README.md) / [Exports](../modules.md) / YieldParams

# Interface: YieldParams

Describes the host-side action to perform during a yield, along with shared
options that apply to any action that involves page navigation or loading.
Exactly one action key (`click`, `goback`, `locators`, `navigate`, `reload`,
`screenshot`) should be set; if none is set, the host waits and re-enters.

## Hierarchy

- `Record`\<`string`, `unknown`\>

  ↳ **`YieldParams`**

## Table of contents

### Properties

- [click](YieldParams.md#click)
- [goback](YieldParams.md#goback)
- [locators](YieldParams.md#locators)
- [navigate](YieldParams.md#navigate)
- [reload](YieldParams.md#reload)
- [screenshot](YieldParams.md#screenshot)
- [timeout](YieldParams.md#timeout)
- [waitUntil](YieldParams.md#waituntil)

## Properties

### click

• `Optional` **click**: `Object`

Signals that the preceding click (already fired inside the engine) may
have triggered a navigation. The host waits for the page to settle using
`waitUntil` before re-entering. Set by the `click` action when `yield`
is `true` on the [Click](Click.md) interface.

#### Defined in

[package/public/Yield.ts:63](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L63)

___

### goback

• `Optional` **goback**: `Object`

Instructs the host to navigate back in the browser history (equivalent
to pressing the Back button) before re-entering the engine.

#### Defined in

[package/public/Yield.ts:69](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L69)

___

### locators

• `Optional` **locators**: [`YieldLocator`](YieldLocator.md)[]

One or more Playwright locator operations for the host to execute and
feed back into the engine as template variables. Each entry specifies
a selector and method; results are stored in `state.vars` under the
locator's `name` key for use in subsequent actions.

#### Defined in

[package/public/Yield.ts:77](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L77)

___

### navigate

• `Optional` **navigate**: [`YieldNavigate`](YieldNavigate.md)

Instructs the host to navigate to the specified URL before re-entering
the engine. The engine updates `state.url` before making this request.

#### Defined in

[package/public/Yield.ts:83](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L83)

___

### reload

• `Optional` **reload**: `Object`

Instructs the host to reload the current page before re-entering
the engine.

#### Defined in

[package/public/Yield.ts:89](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L89)

___

### screenshot

• `Optional` **screenshot**: [`YieldScreenshot`](YieldScreenshot.md)

Instructs the host to take a screenshot before re-entering the engine.
Supports targeting a specific element via `selector`, capturing the full
page, or writing to a named file.

#### Defined in

[package/public/Yield.ts:96](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L96)

___

### timeout

• `Optional` **timeout**: `number`

Maximum time in milliseconds the host should wait for the action to
complete. Falls back to the template-level timeout when omitted.

#### Defined in

[package/public/Yield.ts:48](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L48)

___

### waitUntil

• `Optional` **waitUntil**: [`DocumentLoadState`](../modules.md#documentloadstate)

The navigation/load state the Playwright host should wait for after
any action that causes a page load (e.g. `"load"`, `"domcontentloaded"`,
`"networkidle"`). Falls back to the template-level `waitUntil` when omitted.

#### Defined in

[package/public/Yield.ts:55](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L55)
