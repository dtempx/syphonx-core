[syphonx-core](../README.md) / [Exports](../modules.md) / YieldLocator

# Interface: YieldLocator

Describes a single Playwright locator operation for the host to execute
during a yield. Results are fed back into the engine as template variables
so subsequent actions can use values from the live DOM that are not directly
accessible to the in-page engine (e.g. shadow DOM, iframes).

## Table of contents

### Properties

- [frame](YieldLocator.md#frame)
- [method](YieldLocator.md#method)
- [name](YieldLocator.md#name)
- [params](YieldLocator.md#params)
- [selector](YieldLocator.md#selector)

## Properties

### frame

• `Optional` **frame**: `string`

CSS selector passed to `page.frameLocator()` to scope the locator to a specific iframe.

#### Defined in

[package/public/Yield.ts:123](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L123)

___

### method

• **method**: `string`

Name of the Playwright locator method to call (e.g. `"getAttribute"`,
`"allTextContents"`, `"inputValue"`).
See https://playwright.dev/docs/api/class-locator for available methods.

#### Defined in

[package/public/Yield.ts:117](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L117)

___

### name

• **name**: `string`

Variable name under which the result is stored in `state.vars`. Must start with `_`.

#### Defined in

[package/public/Yield.ts:107](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L107)

___

### params

• `Optional` **params**: `unknown`[]

Positional arguments forwarded to the locator method call.

#### Defined in

[package/public/Yield.ts:120](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L120)

___

### selector

• **selector**: `string`

CSS selector passed to `page.locator()` (or `page.frameLocator()` when `frame` is set).

#### Defined in

[package/public/Yield.ts:110](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L110)
