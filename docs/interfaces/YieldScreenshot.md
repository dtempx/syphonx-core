[syphonx-core](../README.md) / [Exports](../modules.md) / YieldScreenshot

# Interface: YieldScreenshot

Options for a host-side screenshot yield. The host captures the screenshot
according to these options before re-entering the engine.

## Indexable

▪ [key: `string`]: `unknown`

## Table of contents

### Properties

- [fullPage](YieldScreenshot.md#fullpage)
- [name](YieldScreenshot.md#name)
- [selector](YieldScreenshot.md#selector)

## Properties

### fullPage

• `Optional` **fullPage**: `boolean`

When `true`, captures the entire scrollable page rather than just the visible viewport.

#### Defined in

[package/public/Yield.ts:150](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L150)

___

### name

• `Optional` **name**: `string`

Optional filename or identifier for the screenshot.

#### Defined in

[package/public/Yield.ts:144](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L144)

___

### selector

• `Optional` **selector**: `string`

CSS selector of the element to capture. When omitted, captures the viewport (or full page).

#### Defined in

[package/public/Yield.ts:147](https://github.com/dtempx/syphonx-core/blob/main/package/public/Yield.ts#L147)
