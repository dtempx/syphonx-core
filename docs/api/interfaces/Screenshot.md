[syphonx-core](../README.md) / Screenshot

# Interface: Screenshot

Captures a screenshot by yielding control to the Playwright host.
Only executes in online (browser) mode — ignored during offline extraction.

When the engine encounters a screenshot action it yields to the host with
an `"action": "screenshot"` param. The host invokes its `onScreenshot`
callback (see [YieldScreenshot](YieldScreenshot.md)), captures the image, and re-enters
the engine. The `selector` field supports template expressions and is
evaluated at runtime via the engine's expression evaluator.

**`Example`**

```ts
// Capture a full-page screenshot with a custom name
{ "screenshot": { "name": "homepage", "fullPage": true } }
```

**`Example`**

```ts
// Capture a specific element
{ "screenshot": { "selector": "#main-content" } }
```

**`Example`**

```ts
// Conditional screenshot — only when a variable is truthy
{ "screenshot": { "name": "debug", "when": "{_debug}" } }
```

**`Example`**

```ts
// Pass additional host-specific params (e.g. quality, format)
{ "screenshot": { "name": "hero", "params": { "quality": 80, "type": "jpeg" } } }
```

## Table of contents

### Properties

- [fullPage](Screenshot.md#fullpage)
- [name](Screenshot.md#name)
- [params](Screenshot.md#params)
- [selector](Screenshot.md#selector)
- [when](Screenshot.md#when)

## Properties

### fullPage

• `Optional` **fullPage**: `boolean`

When `true`, captures the entire scrollable page rather than just the visible viewport.

#### Defined in

[package/public/Screenshot.ts:41](https://github.com/dtempx/syphonx-core/blob/main/package/public/Screenshot.ts#L41)

___

### name

• `Optional` **name**: `string`

Optional filename or identifier for the screenshot (appears in log output as `SCREENSHOT <name>`).

#### Defined in

[package/public/Screenshot.ts:31](https://github.com/dtempx/syphonx-core/blob/main/package/public/Screenshot.ts#L31)

___

### params

• `Optional` **params**: `Record`\<`string`, `unknown`\>

Additional key-value pairs forwarded to the host's `onScreenshot` callback.
Use this to pass host-specific options such as image format, quality, or
output path that are not part of the core screenshot interface.

#### Defined in

[package/public/Screenshot.ts:48](https://github.com/dtempx/syphonx-core/blob/main/package/public/Screenshot.ts#L48)

___

### selector

• `Optional` **selector**: `string`

CSS selector of the element to capture. Supports template expressions
(e.g. `"{_selector}"`) that are evaluated at runtime. When omitted,
captures the viewport (or the full page if `fullPage` is `true`).

#### Defined in

[package/public/Screenshot.ts:38](https://github.com/dtempx/syphonx-core/blob/main/package/public/Screenshot.ts#L38)

___

### when

• `Optional` **when**: `string`

Expression that controls whether this action executes. Skips the screenshot when falsy.

#### Defined in

[package/public/Screenshot.ts:51](https://github.com/dtempx/syphonx-core/blob/main/package/public/Screenshot.ts#L51)
