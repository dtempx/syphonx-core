[syphonx-core](../README.md) / [Exports](../modules.md) / Template

# Interface: Template

Represents a SyphonX extraction template.

A template is a declarative JSON structure that defines how to extract structured data from HTML.
It contains a set of actions (select, click, navigate, transform, etc.) along with configuration
for the browser environment when running online. Templates can be executed offline against static
HTML via cheerio, or online inside a live browser via Playwright.

## Table of contents

### Properties

- [actions](Template.md#actions)
- [debug](Template.md#debug)
- [headers](Template.md#headers)
- [params](Template.md#params)
- [timeout](Template.md#timeout)
- [unpatch](Template.md#unpatch)
- [url](Template.md#url)
- [useragent](Template.md#useragent)
- [vars](Template.md#vars)
- [viewport](Template.md#viewport)
- [waitUntil](Template.md#waituntil)

## Properties

### actions

• **actions**: [`Action`](../modules.md#action)[]

The ordered set of actions to execute during extraction.
Actions are dispatched sequentially by the controller and may be nested (e.g. inside
`each`, `repeat`, or `switch` actions). Nested actions are recursively flattened during processing.

#### Defined in

[template.ts:17](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L17)

___

### debug

• `Optional` **debug**: `boolean`

Enables verbose debug logging throughout extraction.
When true, the controller emits detailed log messages and postMessage debug updates
during action processing. Can also be enabled via runtime options.

#### Defined in

[template.ts:40](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L40)

___

### headers

• `Optional` **headers**: `Record`\<`string`, `string`\>

Custom HTTP headers applied to all page requests when running online.
Template headers override any default headers set by the host environment.

#### Defined in

[template.ts:50](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L50)

___

### params

• `Optional` **params**: `Record`\<`string`, `unknown`\>

Template-level parameters accessible in formulas as `params.<key>`.
Used for parameterizing URLs, selectors, and other dynamic values within the template.
Runtime params override template params when both are provided.

#### Defined in

[template.ts:29](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L29)

___

### timeout

• `Optional` **timeout**: `number`

Timeout interval in seconds for page navigation, reload, and goback operations.
Converted to milliseconds internally for Playwright navigation calls.

#### Defined in

[template.ts:55](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L55)

___

### unpatch

• `Optional` **unpatch**: `string`[]

List of browser API property paths to restore from an unpatched iframe context.
Used to bypass website monkey-patching of native browser APIs that may interfere
with extraction (e.g. `["Navigator.prototype.sendBeacon"]`).

#### Defined in

[template.ts:61](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L61)

___

### url

• `Optional` **url**: `string`

Default URL to navigate to before extraction begins.
Can be overridden at runtime via options. Supports formula expansion using template params
(e.g. `"https://example.com/search?q={params.query}"`).

#### Defined in

[template.ts:23](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L23)

___

### useragent

• `Optional` **useragent**: `string`

HTTP User-Agent string for the browser context.
Sets the User-Agent header for all page requests when running online via Playwright.

#### Defined in

[template.ts:45](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L45)

___

### vars

• `Optional` **vars**: `Record`\<`string`, `unknown`\>

Initial variables available in the extraction context.
These are merged into the extraction state and can be referenced during action execution.

#### Defined in

[template.ts:34](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L34)

___

### viewport

• `Optional` **viewport**: `Object`

Browser viewport dimensions for the page when running online.
Overrides the default viewport size (1366x768).

#### Type declaration

| Name | Type |
| :------ | :------ |
| `height` | `number` |
| `width` | `number` |

#### Defined in

[template.ts:66](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L66)

___

### waitUntil

• `Optional` **waitUntil**: [`DocumentLoadState`](../modules.md#documentloadstate)

Document load state to wait for during navigation operations.
Controls when navigation is considered complete. Can be overridden per individual
yield operation during extraction.

#### Defined in

[template.ts:72](https://github.com/dtempx/syphonx-core/blob/main/template.ts#L72)
