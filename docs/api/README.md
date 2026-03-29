syphonx-core

# syphonx-core

## Table of contents

### Interfaces

- [AttemptOptions](interfaces/AttemptOptions.md)
- [Break](interfaces/Break.md)
- [Click](interfaces/Click.md)
- [Each](interfaces/Each.md)
- [Error](interfaces/Error.md)
- [ExtractError](interfaces/ExtractError.md)
- [ExtractResult](interfaces/ExtractResult.md)
- [ExtractState](interfaces/ExtractState.md)
- [ExtractStatus](interfaces/ExtractStatus.md)
- [FlatAction](interfaces/FlatAction.md)
- [GoBack](interfaces/GoBack.md)
- [HostOptions](interfaces/HostOptions.md)
- [KeyPress](interfaces/KeyPress.md)
- [Locator](interfaces/Locator.md)
- [Metrics](interfaces/Metrics.md)
- [Navigate](interfaces/Navigate.md)
- [NavigateResult](interfaces/NavigateResult.md)
- [Reload](interfaces/Reload.md)
- [Repeat](interfaces/Repeat.md)
- [Screenshot](interfaces/Screenshot.md)
- [Scroll](interfaces/Scroll.md)
- [Select](interfaces/Select.md)
- [SelectOptions](interfaces/SelectOptions.md)
- [SelectTarget](interfaces/SelectTarget.md)
- [Snooze](interfaces/Snooze.md)
- [Switch](interfaces/Switch.md)
- [Template](interfaces/Template.md)
- [Transform](interfaces/Transform.md)
- [TransformOptions](interfaces/TransformOptions.md)
- [WaitFor](interfaces/WaitFor.md)
- [Yield](interfaces/Yield.md)
- [YieldLocator](interfaces/YieldLocator.md)
- [YieldNavigate](interfaces/YieldNavigate.md)
- [YieldParams](interfaces/YieldParams.md)
- [YieldScreenshot](interfaces/YieldScreenshot.md)
- [YieldState](interfaces/YieldState.md)

### Type Aliases

- [Action](README.md#action)
- [ActionType](README.md#actiontype)
- [BreakAction](README.md#breakaction)
- [ClickAction](README.md#clickaction)
- [DocumentLoadState](README.md#documentloadstate)
- [EachAction](README.md#eachaction)
- [ErrorAction](README.md#erroraction)
- [EvaluateArg](README.md#evaluatearg)
- [EvaluateFunction](README.md#evaluatefunction)
- [EvaluateResult](README.md#evaluateresult)
- [ExtractErrorCode](README.md#extracterrorcode)
- [GoBackAction](README.md#gobackaction)
- [KeyPressAction](README.md#keypressaction)
- [LocatorAction](README.md#locatoraction)
- [LocatorMethod](README.md#locatormethod)
- [NavigateAction](README.md#navigateaction)
- [ReloadAction](README.md#reloadaction)
- [RepeatAction](README.md#repeataction)
- [ScreenshotAction](README.md#screenshotaction)
- [ScrollAction](README.md#scrollaction)
- [ScrollTarget](README.md#scrolltarget)
- [SelectAction](README.md#selectaction)
- [SelectFormat](README.md#selectformat)
- [SelectOn](README.md#selecton)
- [SelectQuery](README.md#selectquery)
- [SelectQueryOp](README.md#selectqueryop)
- [SelectQueryOperand](README.md#selectqueryoperand)
- [SelectQueryOperator](README.md#selectqueryoperator)
- [SelectType](README.md#selecttype)
- [SnoozeAction](README.md#snoozeaction)
- [SnoozeInterval](README.md#snoozeinterval)
- [SnoozeMode](README.md#snoozemode)
- [SwitchAction](README.md#switchaction)
- [TransformAction](README.md#transformaction)
- [WaitForAction](README.md#waitforaction)
- [When](README.md#when)
- [YieldAction](README.md#yieldaction)

### Variables

- [script](README.md#script)

### Functions

- [\_select](README.md#_select)
- [\_transform](README.md#_transform)
- [evaluateFormula](README.md#evaluateformula)
- [expandTemplateUrl](README.md#expandtemplateurl)
- [extract](README.md#extract)
- [extractSync](README.md#extractsync)
- [findAction](README.md#findaction)
- [findLastSelectGroup](README.md#findlastselectgroup)
- [findSelect](README.md#findselect)
- [flattenTemplateActions](README.md#flattentemplateactions)
- [flattenTemplateSelect](README.md#flattentemplateselect)
- [flattenTemplateTransforms](README.md#flattentemplatetransforms)
- [host](README.md#host)
- [invokeAsyncMethod](README.md#invokeasyncmethod)
- [unwrap](README.md#unwrap)

## Type Aliases

### Action

Ƭ **Action**: [`BreakAction`](README.md#breakaction) \| [`ClickAction`](README.md#clickaction) \| [`EachAction`](README.md#eachaction) \| [`ErrorAction`](README.md#erroraction) \| [`GoBackAction`](README.md#gobackaction) \| [`KeyPressAction`](README.md#keypressaction) \| [`LocatorAction`](README.md#locatoraction) \| [`NavigateAction`](README.md#navigateaction) \| [`ReloadAction`](README.md#reloadaction) \| [`RepeatAction`](README.md#repeataction) \| [`ScreenshotAction`](README.md#screenshotaction) \| [`ScrollAction`](README.md#scrollaction) \| [`SelectAction`](README.md#selectaction) \| [`SnoozeAction`](README.md#snoozeaction) \| [`SwitchAction`](README.md#switchaction) \| [`TransformAction`](README.md#transformaction) \| [`WaitForAction`](README.md#waitforaction) \| [`YieldAction`](README.md#yieldaction)

A discriminated union of all possible template actions. Each action is a
single-key object whose key identifies the action type and whose value
holds the action's configuration.

Actions are the building blocks of a SyphonX template. A template's
`actions` array is an ordered sequence of `Action` objects that the
engine executes top-to-bottom. Some actions are **online-only** (they
require a live browser and are silently skipped in offline/cheerio mode),
while others work in both modes.

**Categories:**
- **Data extraction:** [SelectAction](README.md#selectaction), [TransformAction](README.md#transformaction)
- **Control flow:** [RepeatAction](README.md#repeataction), [EachAction](README.md#eachaction), [SwitchAction](README.md#switchaction), [BreakAction](README.md#breakaction)
- **Browser interaction:** [ClickAction](README.md#clickaction), [ScrollAction](README.md#scrollaction), [KeyPressAction](README.md#keypressaction), [LocatorAction](README.md#locatoraction)
- **Navigation:** [NavigateAction](README.md#navigateaction), [GoBackAction](README.md#gobackaction), [ReloadAction](README.md#reloadaction)
- **Timing / async:** [SnoozeAction](README.md#snoozeaction), [WaitForAction](README.md#waitforaction), [YieldAction](README.md#yieldaction)
- **Diagnostics:** [ErrorAction](README.md#erroraction), [ScreenshotAction](README.md#screenshotaction)

**`Example`**

```ts
// A minimal template with two actions: extract the page title
{
  "actions": [
    { "select": [{ "name": "title", "query": [["h1"]] }] },
    { "transform": [{ "query": ["p", ["replaceText", "{value.trim()}"]] }] }
  ]
}
```

#### Defined in

[package/public/Action.ts:49](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L49)

___

### ActionType

Ƭ **ActionType**: ``"break"`` \| ``"click"`` \| ``"each"`` \| ``"error"`` \| ``"goback"`` \| ``"locator"`` \| ``"keypress"`` \| ``"navigate"`` \| ``"reload"`` \| ``"repeat"`` \| ``"screenshot"`` \| ``"scroll"`` \| ``"select"`` \| ``"snooze"`` \| ``"switch"`` \| ``"transform"`` \| ``"waitfor"`` \| ``"yield"``

A string literal union of all action type keys. Corresponds to the
property name used to identify each action in the discriminated
[Action](README.md#action) union (e.g. `"select"`, `"click"`, `"repeat"`).

#### Defined in

[package/public/Action.ts:314](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L314)

___

### BreakAction

Ƭ **BreakAction**: `Object`

Conditionally exits the enclosing [repeat](README.md#repeataction) or
[each](README.md#eachaction) loop. Online-only — bypassed in offline mode.
Evaluates an optional `when` guard and/or a DOM `query` to decide whether
to break. Commonly used to detect the end of pagination (e.g. a "next"
button disappearing).

**`Example`**

```ts
{ "break": { "query": [["#next"]], "on": "none" } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `break` | [`Break`](interfaces/Break.md) |

#### Defined in

[package/public/Action.ts:80](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L80)

___

### ClickAction

Ƭ **ClickAction**: `Object`

Simulates a user click on a DOM element matched by a CSS/jQuery/XPath
selector. Online-only. Supports post-click waiting ([WaitFor](interfaces/WaitFor.md)),
snooze delays, and yielding to the host for navigation-triggering clicks.

**`Example`**

```ts
{ "click": { "query": [["#next"]] } }
```

**`Example`**

```ts
{ "click": { "query": [["a.next"]], "waitfor": { "query": [["h1"]] } } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `click` | [`Click`](interfaces/Click.md) |

#### Defined in

[package/public/Action.ts:93](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L93)

___

### DocumentLoadState

Ƭ **DocumentLoadState**: ``"load"`` \| ``"domcontentloaded"`` \| ``"networkidle"``

Specifies the document load state to wait for before proceeding.
Based on Playwright's `waitUntil` option.

- `"load"` — Waits for the `load` event, fired when all resources (stylesheets, images) have loaded.
- `"domcontentloaded"` — Waits for the `DOMContentLoaded` event, fired when HTML is parsed and deferred scripts have executed.
- `"networkidle"` — Waits until there are no network connections for at least 500ms.

#### Defined in

[package/public/DocumentLoadState.ts:9](https://github.com/dtempx/syphonx-core/blob/main/package/public/DocumentLoadState.ts#L9)

___

### EachAction

Ƭ **EachAction**: `Object`

Iterates over DOM elements matched by a `query`, running a sequence of
nested `actions` once per element with that element set as the active
context. Works in both online and offline modes.

**`Example`**

```ts
{
 *     "each": {
 *         "query": [["ul > li"]],
 *         "actions": [
 *             { "select": [{ "name": "item", "repeated": true, "query": [["."]] }] }
 *         ]
 *     }
 * }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `each` | [`Each`](interfaces/Each.md) |

#### Defined in

[package/public/Action.ts:111](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L111)

___

### ErrorAction

Ƭ **ErrorAction**: `Object`

Defines a conditional error that fires based on a DOM query or a `when`
expression. Controls severity via `level` (0 = fatal, 1 = retryable) and
can halt or continue processing. Works in both online and offline modes.

**`Example`**

```ts
{ "error": { "when": "{_status === 'blocked'}", "message": "Page is blocked", "level": 0 } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | [`Error`](interfaces/Error.md) |

#### Defined in

[package/public/Action.ts:122](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L122)

___

### EvaluateArg

Ƭ **EvaluateArg**: [`ExtractState`](interfaces/ExtractState.md) \| \{ `select`: [`Select`](interfaces/Select.md)[]  } \| \{ `transform`: [`Transform`](interfaces/Transform.md)[]  } \| \{ `sync`: [`ExtractState`](interfaces/ExtractState.md)  }

Union type for arguments passed to the in-browser evaluation function.
Represents the different modes of invoking the extraction engine:
full extraction state, standalone select, standalone transform, or synchronous extraction.

#### Defined in

[host.ts:410](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L410)

___

### EvaluateFunction

Ƭ **EvaluateFunction**: (`arg`: [`EvaluateArg`](README.md#evaluatearg)) => `Promise`\<[`EvaluateResult`](README.md#evaluateresult)\>

Function signature for invoking the extraction engine inside the browser context.

#### Type declaration

▸ (`arg`): `Promise`\<[`EvaluateResult`](README.md#evaluateresult)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | [`EvaluateArg`](README.md#evaluatearg) |

##### Returns

`Promise`\<[`EvaluateResult`](README.md#evaluateresult)\>

#### Defined in

[host.ts:416](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L416)

___

### EvaluateResult

Ƭ **EvaluateResult**: [`ExtractState`](interfaces/ExtractState.md)

The result returned by the in-browser evaluation function, representing the updated extraction state.

#### Defined in

[host.ts:413](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L413)

___

### ExtractErrorCode

Ƭ **ExtractErrorCode**: ``"app-error"`` \| ``"click-timeout"`` \| ``"click-required"`` \| ``"error-limit"`` \| ``"eval-error"`` \| ``"external-error"`` \| ``"fatal-error"`` \| ``"host-error"`` \| ``"invalid-select"`` \| ``"invalid-operator"`` \| ``"invalid-operand"`` \| ``"select-required"`` \| ``"waitfor-timeout"``

Identifies the type of error that occurred during extraction.

- `"app-error"` — A user-defined error from a template `error` action. This is the default error code when no specific code is provided.
- `"click-timeout"` — A `click` action's `waitfor` condition was not satisfied within the timeout period.
- `"click-required"` — A `click` action with `required: true` found no matching elements for its query selector.
- `"error-limit"` — A `repeat` action exceeded its configured error limit across iterations.
- `"eval-error"` — A formula evaluation, selector resolution, or operation execution failed. Covers invalid queries, undefined context references, unsupported offline XPath, and failed operator resolution.
- `"external-error"` — Reserved for errors originating from external systems.
- `"fatal-error"` — An unrecoverable exception during extraction. Produced by the top-level error handler in `extract()` or `extractSync()` when an uncaught error escapes the controller.
- `"host-error"` — A host callback operation (goback, locator, reload, screenshot, or yield) failed. These errors originate from the host environment rather than the extraction engine.
- `"invalid-select"` — A `select` definition has an invalid structure, such as missing a required `query`, `union`, or `value`, or a `waitfor` select that is not internal, boolean, and non-repeated.
- `"invalid-operator"` — An unsupported or unrecognized jQuery operator was used in a selector chain.
- `"invalid-operand"` — An operator received an invalid argument, such as a malformed regex, failed type coercion, or too many parameters.
- `"select-required"` — A `select` with `required: true` resolved to an empty or null value.
- `"waitfor-timeout"` — A `waitfor` action's query or select condition was not satisfied within the timeout period.

#### Defined in

[package/public/ExtractErrorCode.ts:18](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractErrorCode.ts#L18)

___

### GoBackAction

Ƭ **GoBackAction**: `Object`

Navigates the browser back in history (equivalent to pressing the Back
button). Online-only. Yields to the Playwright host which calls
`page.goBack()`.

**`Example`**

```ts
{ "goback": {} }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `goback` | [`GoBack`](interfaces/GoBack.md) |

#### Defined in

[package/public/Action.ts:133](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L133)

___

### KeyPressAction

Ƭ **KeyPressAction**: `Object`

Dispatches a synthetic `keydown` keyboard event on the document.
Online-only. Useful for interacting with pages that respond to keyboard
shortcuts or key-driven UI updates.

**`Example`**

```ts
{ "keypress": { "key": "Escape" } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `keypress` | [`KeyPress`](interfaces/KeyPress.md) |

#### Defined in

[package/public/Action.ts:144](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L144)

___

### LocatorAction

Ƭ **LocatorAction**: `Object`

Invokes one or more Playwright locators to access DOM elements not
reachable via standard selectors — such as elements inside iframes or
shadow DOM trees. Online-only. Results are stored as template variables
for use in subsequent actions.

**`Example`**

```ts
{ "locator": [{ "name": "_text", "frame": "#iframe", "selector": "body", "method": "allInnerTexts" }] }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `locator` | [`Locator`](interfaces/Locator.md)[] |

#### Defined in

[package/public/Action.ts:156](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L156)

___

### LocatorMethod

Ƭ **LocatorMethod**: `string`

A Playwright [Locator](https://playwright.dev/docs/api/class-locator) method name
to invoke on matched elements. Common methods include `"getAttribute"`,
`"textContent"`, `"innerHTML"`, `"allTextContents"`, and `"allInnerTexts"`.

#### Defined in

[package/public/Locator.ts:126](https://github.com/dtempx/syphonx-core/blob/main/package/public/Locator.ts#L126)

___

### NavigateAction

Ƭ **NavigateAction**: `Object`

Navigates the browser to a URL by yielding to the Playwright host.
Online-only. The URL supports expression interpolation for dynamic
navigation based on previously extracted values.

**`Example`**

```ts
{ "navigate": { "url": "https://example.com/page/{_nextPage}" } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `navigate` | [`Navigate`](interfaces/Navigate.md) |

#### Defined in

[package/public/Action.ts:167](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L167)

___

### ReloadAction

Ƭ **ReloadAction**: `Object`

Reloads the current page by yielding to the Playwright host. Online-only.
Optionally waits for a specific load state before continuing.

**`Example`**

```ts
{ "reload": { "waitUntil": "networkidle" } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reload` | [`Reload`](interfaces/Reload.md) |

#### Defined in

[package/public/Action.ts:177](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L177)

___

### RepeatAction

Ƭ **RepeatAction**: `Object`

Loops a sequence of `actions` up to `limit` times, without tying
iterations to specific DOM elements. Typically used for open-ended
pagination or polling where the stopping condition is determined at
runtime (e.g. a "next" button disappearing). Works in both online and
offline modes.

**`Example`**

```ts
{ "repeat": { "limit": 10, "actions": [
 *     { "select": [{ "name": "titles", "repeated": true, "query": [["h1"]] }] },
 *     { "break": { "query": [["#next"]], "on": "none" } },
 *     { "click": { "query": [["#next"]] } }
 * ] } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `repeat` | [`Repeat`](interfaces/Repeat.md) |

#### Defined in

[package/public/Action.ts:194](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L194)

___

### ScreenshotAction

Ƭ **ScreenshotAction**: `Object`

Captures a screenshot by yielding to the Playwright host. Online-only.
Can target a specific element via `selector` or capture the full page.

**`Example`**

```ts
{ "screenshot": { "name": "homepage", "fullPage": true } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `screenshot` | [`Screenshot`](interfaces/Screenshot.md) |

#### Defined in

[package/public/Action.ts:203](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L203)

___

### ScrollAction

Ƭ **ScrollAction**: `Object`

Scrolls the page to the top/bottom or scrolls a specific element into
view. Online-only. Commonly used inside repeat loops to trigger
infinite-scroll loading.

**`Example`**

```ts
{ "scroll": { "target": "bottom" } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `scroll` | [`Scroll`](interfaces/Scroll.md) |

#### Defined in

[package/public/Action.ts:214](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L214)

___

### ScrollTarget

Ƭ **ScrollTarget**: ``"top"`` \| ``"bottom"``

Specifies a named scroll destination for page-level scrolling.
- `"top"` — scrolls to the very top of the page (`y = 0`).
- `"bottom"` — scrolls to the very bottom of the page (`y = document.body.scrollHeight`).

Used by the `target` property of [Scroll](interfaces/Scroll.md). For element-level scrolling, use `query` instead.

#### Defined in

[package/public/Scroll.ts:96](https://github.com/dtempx/syphonx-core/blob/main/package/public/Scroll.ts#L96)

___

### SelectAction

Ƭ **SelectAction**: `Object`

Extracts data from the DOM using CSS/jQuery/XPath selectors. This is the
primary data-extraction action and the heart of most templates. Each entry
in the array defines a named (or unnamed/projected) data field with its
query, type coercion, formatting, and optional sub-selections for nested
object structures. Works in both online and offline modes.

**`Example`**

```ts
{
 *     "select": [
 *         {
 *             "name": "title",
 *             "query": [["h1"]] 
 *         },
 *         {
 *              "name": "price",
 *              "type": "number",
 *              "query": [["span.price"]]
 *         }
 *     ]
 * }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `select` | [`Select`](interfaces/Select.md)[] |

#### Defined in

[package/public/Action.ts:239](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L239)

___

### SelectFormat

Ƭ **SelectFormat**: ``"href"`` \| ``"multiline"`` \| ``"singleline"`` \| ``"innertext"`` \| ``"textcontent"`` \| ``"none"``

Controls how extracted string values are formatted.
- `"href"` — resolves relative URLs against the page origin
- `"multiline"` — preserves line breaks (default for strings)
- `"singleline"` — collapses whitespace into single spaces
- `"innertext"` — uses the element's `innerText`
- `"textcontent"` — uses the element's `textContent`
- `"none"` — no formatting applied

#### Defined in

[package/public/Select.ts:416](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L416)

___

### SelectOn

Ƭ **SelectOn**: ``"any"`` \| ``"all"`` \| ``"none"``

Determines how multiple query results are aggregated for boolean checks.
- `"any"` — passes if any query stage matches
- `"all"` — passes only if all query stages match
- `"none"` — passes only if no query stages match

#### Defined in

[package/public/Select.ts:424](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L424)

___

### SelectQuery

Ƭ **SelectQuery**: [`string`, ...SelectQueryOp[]]

A selector query: a CSS/XPath selector string followed by zero or more chained operations.

#### Defined in

[package/public/Select.ts:396](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L396)

___

### SelectQueryOp

Ƭ **SelectQueryOp**: [`string`, ...unknown[]]

A chained query operation: an operator name followed by its arguments (e.g. `["attr", "href"]`).

#### Defined in

[package/public/Select.ts:399](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L399)

___

### SelectQueryOperand

Ƭ **SelectQueryOperand**: `unknown`

An operand value passed to a query operator.

#### Defined in

[package/public/Select.ts:405](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L405)

___

### SelectQueryOperator

Ƭ **SelectQueryOperator**: `string`

The operator name in a query operation (e.g. `"attr"`, `"split"`, `"trim"`).

#### Defined in

[package/public/Select.ts:402](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L402)

___

### SelectType

Ƭ **SelectType**: ``"string"`` \| ``"number"`` \| ``"boolean"`` \| ``"object"``

The data type that a selected value is coerced to.
- `"string"` — formatted according to the `format` option
- `"number"` — parsed with `parseFloat`
- `"boolean"` — truthy/falsy coercion
- `"object"` — used with sub-selects to produce structured data

#### Defined in

[package/public/Select.ts:393](https://github.com/dtempx/syphonx-core/blob/main/package/public/Select.ts#L393)

___

### SnoozeAction

Ƭ **SnoozeAction**: `Object`

Pauses execution for a specified duration. Online-only — in offline mode
the snooze is logged but skipped entirely. Accepts shorthand forms: a bare
number (`60`), a single-element tuple (`[60]`), a range (`[1, 2]`), or the
full [Snooze](interfaces/Snooze.md) object with `interval` and optional `when` guard.

**`Example`**

```ts
{ "snooze": [1, 2] }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `snooze` | [`Snooze`](interfaces/Snooze.md) \| `number` \| [`number`] \| [`number`, `number`] |

#### Defined in

[package/public/Action.ts:251](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L251)

___

### SnoozeInterval

Ƭ **SnoozeInterval**: [`number`, `number`] \| [`number`, `number`, [`SnoozeMode`](README.md#snoozemode)]

A compact tuple form for specifying a snooze pause on actions like
[Click](interfaces/Click.md). Values are in seconds. The actual sleep duration is
randomized between `min` and `max` (capped by the template's max timeout).

- `[min, max]` — sleep a random duration between `min` and `max` seconds,
  defaulting to `"before"` mode.
- `[min, max, mode]` — same, but explicitly sets when the pause occurs
  relative to the action (see [SnoozeMode](README.md#snoozemode)).

**`Example`**

```ts
// Pause 1–2 seconds before clicking (default "before" mode)
{ "click": { "query": [["a"]], "snooze": [1, 2] } }
```

#### Defined in

[package/public/Snooze.ts:28](https://github.com/dtempx/syphonx-core/blob/main/package/public/Snooze.ts#L28)

___

### SnoozeMode

Ƭ **SnoozeMode**: ``"before"`` \| ``"after"`` \| ``"before-and-after"``

Controls the timing of a pause relative to an action. Used within
[SnoozeInterval](README.md#snoozeinterval) on actions like [Click](interfaces/Click.md) that support
before/after pausing.

- `"before"` (default) — pause *before* the action executes.
- `"after"` — pause *after* the action (and any waitfor) completes.
- `"before-and-after"` — pause both before and after the action.

#### Defined in

[package/public/Snooze.ts:12](https://github.com/dtempx/syphonx-core/blob/main/package/public/Snooze.ts#L12)

___

### SwitchAction

Ƭ **SwitchAction**: `Object`

Conditional branching — evaluates an ordered array of cases and runs the
`actions` of the first case whose `query` matches (or whose `when`
expression is truthy). A case with no `query` acts as a default/fallback.
Works in both online and offline modes.

**`Example`**

```ts
{ "switch": [
 *     { "query": [["h1:contains('News')"]], "actions": [{ "select": [{ "name": "content", "query": [["p"]] }] }] },
 *     { "actions": [{ "select": [{ "name": "content", "query": [["i"]] }] }] }
 * ] }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `switch` | [`Switch`](interfaces/Switch.md)[] |

#### Defined in

[package/public/Action.ts:266](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L266)

___

### TransformAction

Ƭ **TransformAction**: `Object`

Applies in-place DOM mutations using jQuery operations such as
`replaceWith`, `replaceText`, `addClass`, `attr`, `wrap`, `map`, and
`filter`. Unlike `select` (which reads the DOM), `transform` writes back
to the DOM, reshaping page HTML before or between extraction steps. Works
in both online and offline modes (except `autopaginate`, which is
online-only).

**`Example`**

```ts
{ "transform": [{ "query": ["h3", ["replaceWith", "{`<p>${value}</p>`}"]] }] }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transform` | [`Transform`](interfaces/Transform.md)[] |

#### Defined in

[package/public/Action.ts:280](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L280)

___

### WaitForAction

Ƭ **WaitForAction**: `Object`

Polls the DOM until a condition is met or a timeout expires. Used as a
standalone action to wait for elements to appear, or embedded inside
[Click](interfaces/Click.md) to wait after a click. Online-only. Specify `query` to wait
for a selector match, or `select` to wait for a boolean extraction to
become truthy.

**`Example`**

```ts
{ "waitfor": { "query": [["h1"]], "required": true, "timeout": 5 } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `waitfor` | [`WaitFor`](interfaces/WaitFor.md) |

#### Defined in

[package/public/Action.ts:293](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L293)

___

### When

Ƭ **When**: `string`

A conditional expression that controls whether an action or selection executes.

Expressed as a formula string wrapped in curly braces: `"{expression}"`.
The expression is evaluated at runtime against the current template variables
(`state.vars`) and extracted data. When the expression is falsy, the action
is skipped. When `when` is omitted entirely, the action always executes.

**Expression syntax:** Standard JavaScript-like expressions evaluated by
`evaluateFormula`. Variables are referenced by name (e.g. `{_ok}`) and
support operators such as `!`, `===`, template literals, etc. Template
variables (names starting with `_`) are stored in `state.vars` and are
available in expressions but are not included in the final output data.

**Skipped selections:** When a `select` field is skipped because its `when`
condition is falsy, its value in the result is `null` (not `undefined`).

**Evaluation errors:** If the expression throws, the condition is treated as
`false` and the action is skipped.

**Logging:** Evaluated conditions are written to the log as
`WHEN "{expression}" -> true/false`. A skipped action is logged as `SKIPPED`.
An action bypassed because it cannot run in the current mode (e.g. an online-
only action running offline) is logged as `BYPASSED`.

**`Example`**

```ts
// when/1: #xyz exists so _ok=true → a1 gets "lorum", a2 is null (skipped)
// when/2: #xyz missing so _ok=false → a1 is null (skipped), a2 gets "ipsum"
{ name: "_ok", type: "boolean", query: [["#xyz"]] }
{ name: "a1",  query: [["#a1"]], when: "{_ok}" }
{ name: "a2",  query: [["#a2"]], when: "{!_ok}" }
```

**`Example`**

```ts
// when/3: when used inside a nested subselect (object type)
{
  name: "obj", type: "object", query: [["section"]],
  select: [
    { name: "_ok", type: "boolean", query: [["#xyz"]] },
    { name: "a1", query: [["#a1"]], when: "{_ok}" },
    { name: "a2", query: [["#a2"]], when: "{!_ok}" }
  ]
}
```

**`Example`**

```ts
// errors/3: comparison expression — raise an error only when _h1 matches a value
{ select: [{ name: "_h1", query: [["h1"]] }] }
{ error: { when: "{_h1 === 'xyz'}", message: "{`${_h1} error`}", level: 1 } }
```

#### Defined in

[package/public/When.ts:49](https://github.com/dtempx/syphonx-core/blob/main/package/public/When.ts#L49)

___

### YieldAction

Ƭ **YieldAction**: `Object`

Yields control back to the Playwright host, suspending engine execution
until the host re-enters. Online-only. Use `params` to instruct the host
to perform a specific action (navigate, reload, screenshot, etc.) before
re-entering. When `params` is omitted the host waits for the page to
settle before resuming.

**`Example`**

```ts
{ "yield": { "params": { "waitUntil": "domcontentloaded" } } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `yield` | [`Yield`](interfaces/Yield.md) |

#### Defined in

[package/public/Action.ts:306](https://github.com/dtempx/syphonx-core/blob/main/package/public/Action.ts#L306)

## Variables

### script

• `Const` **script**: ``""``

Contains the full SyphonX extraction engine script that can be injected into a browser page context.

**`Example`**

```ts
import * as playwright from 'playwright';
import * as syphonx from 'syphonx-core';

const url = 'https://www.example.com/';
const template = { actions: [ { select: [{ name: 'title', query: [['h1']] }] } ] };

const browser = await playwright.chromium.launch();
const page = await browser.newPage();
await page.goto(url);

const result = await page.evaluate(`${syphonx.script}(${JSON.stringify({ ...template, url })})`);
console.log(JSON.stringify(result, null, 2));
```

#### Defined in

[host.ts:403](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L403)

## Functions

### \_select

▸ **_select**(`selects`, `options?`): [`ExtractState`](interfaces/ExtractState.md)

Evaluates a set of selectors or a template against the current DOM and returns
the extracted data.

Initializes a Controller and runs each [Select](interfaces/Select.md) definition, resolving
queries (CSS/jQuery/XPath), values, pivots, and unions. If a [Template](interfaces/Template.md) is
provided instead of a `Select[]` array, its actions are flattened to extract the
select definitions. Results are returned as named fields in the extraction state's
`data`, or as a single unnamed value for anonymous selects.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selects` | [`Select`](interfaces/Select.md)[] \| [`Template`](interfaces/Template.md) | An array of select definitions, or a template whose actions contain select definitions to be flattened and evaluated. |
| `options` | [`SelectOptions`](interfaces/SelectOptions.md) | Optional configuration including `url`, `vars`, `debug`, `context`, `root`, and an `unwrap` flag that unwraps singleton arrays in the output data. |

#### Returns

[`ExtractState`](interfaces/ExtractState.md)

The extraction state with populated `data`, `errors`, and `metrics`.

**`Example`**

```ts
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as syphonx from 'syphonx-core';

const html = fs.readFileSync('./example.html', 'utf-8');
const root = cheerio.load(html);
const result = syphonx.select(select, { root });
const data = syphonx.unwrap(result.data);
console.log(JSON.stringify(data, null, 2));
```

#### Defined in

[package/select.ts:51](https://github.com/dtempx/syphonx-core/blob/main/package/select.ts#L51)

___

### \_transform

▸ **_transform**(`transforms`, `options?`): `void`

Applies an array of DOM transforms to the current document, modifying the DOM in-place.

This is a standalone entry point for running transforms outside of a full `extract()` call.
It initializes a Controller with the given options, then delegates to
`controller.transform()` to execute each [Transform](interfaces/Transform.md) step in sequence.

If a [Template](interfaces/Template.md) object is passed instead of a `Transform[]` array, the function
flattens all transform actions from the template's `actions` tree before executing them.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transforms` | [`Transform`](interfaces/Transform.md)[] \| [`Template`](interfaces/Template.md) | An array of [Transform](interfaces/Transform.md) steps to apply, or a [Template](interfaces/Template.md) whose `actions` will be scanned for embedded transform actions. |
| `options` | [`TransformOptions`](interfaces/TransformOptions.md) | Optional [TransformOptions](interfaces/TransformOptions.md) controlling variables, debugging, and initial data state. |

#### Returns

`void`

#### Defined in

[package/transform.ts:35](https://github.com/dtempx/syphonx-core/blob/main/package/transform.ts#L35)

___

### evaluateFormula

▸ **evaluateFormula**(`formula`, `scope?`): `unknown`

Evaluates a JavaScript expression within the specified scope, returning a computed result.

Uses the `Function` constructor to dynamically compile and execute the expression,
with each key in `scope` injected as a named parameter accessible within the formula.

Formulas in SyphonX templates are denoted by `={...}` syntax (the wrapper is stripped
by the caller before this function is invoked). Typical formulas include boolean
conditions (`count > 5`, `!done`), computed values (`price * qty`), and template
literals (`` `${baseUrl}/page/${id}` ``).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `formula` | `string` | A JavaScript expression to evaluate (not a statement — must be usable after `return`). |
| `scope` | `Record`\<`string`, `unknown`\> | An object whose keys become local variable names available to the formula. Common scope entries include template variables (prefixed with `_`), extraction state properties (`data`, `params`, `errors`, etc.), and the current select context (`value`, `index`, `count`). |

#### Returns

`unknown`

The result of evaluating the expression, which may be any type.

**`Example`**

```ts
// Simple arithmetic
evaluateFormula("price * qty", { price: 9.99, qty: 3 }); // 29.97
```

**`Example`**

```ts
// Boolean condition used in a When action
evaluateFormula("index < count - 1", { index: 2, count: 5 }); // true
```

**`Example`**

```ts
// Template literal for URL construction
evaluateFormula("`${baseUrl}/page/${id}`", { baseUrl: "https://example.com", id: 42 });
// "https://example.com/page/42"
```

#### Defined in

[package/lib/formula.ts:33](https://github.com/dtempx/syphonx-core/blob/main/package/lib/formula.ts#L33)

___

### expandTemplateUrl

▸ **expandTemplateUrl**(`url`, `params?`): `string`

Expands a template URL by evaluating it as a formula expression if it is wrapped
in formula delimiters (e.g. `{...}`), substituting parameter values and URI-encoding the result.
Returns the URL unchanged if it is not a formula.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL string, possibly a formula expression. |
| `params?` | `Record`\<`string`, `unknown`\> | Parameters available for substitution within the formula. |

#### Returns

`string`

The expanded and URI-encoded URL.

#### Defined in

[host.ts:321](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L321)

___

### extract

▸ **extract**(`state`): `Promise`\<[`ExtractState`](interfaces/ExtractState.md)\>

Executes a SyphonX extraction template against the current DOM.

Initializes a Controller and runs all actions in `state.actions` sequentially.
When running inside a browser (online mode), the engine may throw `"YIELD"` to
transfer control back to the host for external operations (navigation, clicks,
screenshots), after which the host re-enters `extract` to resume execution.
A `"STOP"` throw halts extraction early. Any other error is captured as a
`"fatal-error"` in the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`ExtractState`](interfaces/ExtractState.md) & \{ `unwrap?`: `boolean`  } | The extraction state containing actions, selectors, variables, and configuration. Extended with an optional `unwrap` flag that, when `true`, unwraps singleton arrays in the output data after extraction completes (skipped if yielding). |

#### Returns

`Promise`\<[`ExtractState`](interfaces/ExtractState.md)\>

The mutated extraction state with populated `data`, `errors`, and `metrics`.

**`Example`**

```ts
import * as cheerio from 'cheerio';
import * as syphonx from 'syphonx-core';
import { promises as fs } from 'fs';

const template = JSON.parse(await fs.readFile('./template.json', 'utf-8'));
const html = await fs.readFile('./example.html', 'utf-8');

const root = cheerio.load(html);
const result = await syphonx.extract({ ...template, root } as syphonx.ExtractState);
console.log(JSON.stringify(result, null, 2));
```

#### Defined in

[package/extract.ts:33](https://github.com/dtempx/syphonx-core/blob/main/package/extract.ts#L33)

___

### extractSync

▸ **extractSync**(`state`): [`ExtractState`](interfaces/ExtractState.md)

Executes a SyphonX extraction template synchronously against the current DOM.

Initializes a Controller and iterates through `state.actions`, processing
only `select` and `transform` action types. Unlike [extract](README.md#extract), this function
runs synchronously and does not support yielding, browser actions (navigation,
clicks, screenshots), or the full action dispatch pipeline. Any error is captured
as a `"fatal-error"` in the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `Partial`\<[`ExtractState`](interfaces/ExtractState.md)\> & \{ `unwrap?`: `boolean`  } | A partial extraction state containing actions, selectors, variables, and configuration. Extended with an optional `unwrap` flag that, when `true`, unwraps singleton arrays in the output data after extraction completes. |

#### Returns

[`ExtractState`](interfaces/ExtractState.md)

The extraction state with populated `data`, `errors`, and `metrics`.

#### Defined in

[package/extract-sync.ts:20](https://github.com/dtempx/syphonx-core/blob/main/package/extract-sync.ts#L20)

___

### findAction

▸ **findAction**(`actions`, `action_type`): [`Action`](README.md#action)[]

Finds all actions of the specified type within a nested action tree.
Flattens the tree first, then filters by the given action type key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actions` | [`Action`](README.md#action)[] | The top-level actions array to search. |
| `action_type` | [`ActionType`](README.md#actiontype) | The action type key to filter by (e.g. `"select"`, `"click"`). |

#### Returns

[`Action`](README.md#action)[]

An array of matching [Action](README.md#action) objects.

#### Defined in

[package/utilities.ts:25](https://github.com/dtempx/syphonx-core/blob/main/package/utilities.ts#L25)

___

### findLastSelectGroup

▸ **findLastSelectGroup**(`actions`): [`Select`](interfaces/Select.md)[] \| `undefined`

Returns the last select group in the action tree, or `undefined` if none exist.
Useful for identifying the final set of select fields that produce the template's output.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actions` | [`Action`](README.md#action)[] | The top-level actions array to search. |

#### Returns

[`Select`](interfaces/Select.md)[] \| `undefined`

The [Select](interfaces/Select.md) array from the last select action, or `undefined`.

#### Defined in

[package/utilities.ts:37](https://github.com/dtempx/syphonx-core/blob/main/package/utilities.ts#L37)

___

### findSelect

▸ **findSelect**(`actions`, `name`): [`Select`](interfaces/Select.md)[]

Finds all [Select](interfaces/Select.md) entries with the given name across every select action in the tree.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actions` | [`Action`](README.md#action)[] | The top-level actions array to search. |
| `name` | `string` | The select field name to match. |

#### Returns

[`Select`](interfaces/Select.md)[]

An array of matching [Select](interfaces/Select.md) objects (may be empty).

#### Defined in

[package/utilities.ts:48](https://github.com/dtempx/syphonx-core/blob/main/package/utilities.ts#L48)

___

### flattenTemplateActions

▸ **flattenTemplateActions**(`actions`, `result?`, `level?`, `n?`): [`FlatAction`](interfaces/FlatAction.md)[]

Recursively flattens a nested action tree into a linear array of [FlatAction](interfaces/FlatAction.md) objects.
Descends into `each`, `repeat`, and `switch` actions, tracking the nesting `level`
and the 1-based `case` index for switch branches.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `actions` | [`Action`](README.md#action)[] | `undefined` | The actions array to flatten. |
| `result` | [`FlatAction`](interfaces/FlatAction.md)[] | `[]` | Accumulator array (used internally for recursion). |
| `level` | `number` | `0` | Current nesting depth (0 = top-level). |
| `n?` | `number` | `undefined` | The 1-based switch case index, if inside a switch branch. |

#### Returns

[`FlatAction`](interfaces/FlatAction.md)[]

A flat array of all actions with their nesting metadata.

#### Defined in

[package/utilities.ts:68](https://github.com/dtempx/syphonx-core/blob/main/package/utilities.ts#L68)

___

### flattenTemplateSelect

▸ **flattenTemplateSelect**(`actions`, `names?`): [`Select`](interfaces/Select.md)[]

Collapses multiple select actions to a single select action.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actions` | [`Action`](README.md#action)[] | The action tree to collapse. |
| `names?` | `string`[] | Optionally, only collapse the specified names. |

#### Returns

[`Select`](interfaces/Select.md)[]

Returns the collapsed select actions.

#### Defined in

[package/utilities.ts:88](https://github.com/dtempx/syphonx-core/blob/main/package/utilities.ts#L88)

___

### flattenTemplateTransforms

▸ **flattenTemplateTransforms**(`actions`): [`Transform`](interfaces/Transform.md)[]

Collects all [Transform](interfaces/Transform.md) entries from every transform action in the tree
into a single flat array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actions` | [`Action`](README.md#action)[] | The top-level actions array to search. |

#### Returns

[`Transform`](interfaces/Transform.md)[]

A flat array of all transform steps across the action tree.

#### Defined in

[package/utilities.ts:109](https://github.com/dtempx/syphonx-core/blob/main/package/utilities.ts#L109)

___

### host

▸ **host**(`options`): `Promise`\<[`ExtractResult`](interfaces/ExtractResult.md)\>

Orchestrates an online extraction by navigating to a URL, running the extraction engine
inside the browser, and processing yield/re-enter cycles for browser actions (navigate,
go back, reload, click, screenshot, locator operations).

This is the primary entry point for online (browser-based) extraction. The host function
coordinates between the extraction engine running inside the page and the external browser
automation layer (e.g. Playwright) via callback hooks provided in [HostOptions](interfaces/HostOptions.md).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`HostOptions`](interfaces/HostOptions.md) | Configuration including the template, URL, callbacks, and retry settings. |

#### Returns

`Promise`\<[`ExtractResult`](interfaces/ExtractResult.md)\>

The final extraction result with data, errors, metrics, and HTTP status.

**`Throws`**

If `template`, `url`, `onNavigate`, or `onExtract` are not provided.

**`Example`**

```ts
const result = await host({
    url,
    extractHtml: options.html,
    template: {
        actions: options.actions,
        params: options.params,
        vars: options.vars,
        debug: options.debug,
        timeout
    },
    onExtract: async (state: ExtractState, script: string) => {
        const fn = new Function("state", `return ${script}(state)`);
        const result = await page.evaluate<ExtractState, ExtractState>(fn as any, state);
        return result;
    },
    onHtml: async () => {
        const html = await page.evaluate(() => document.querySelector("*")!.outerHTML);
        return html;
    },
    onNavigate: async ({ url, timeout, waitUntil }) => {
        const response = await page.goto(url, { timeout, waitUntil });
        const status = response?.status();
        return { status };
    },
    onYield: async ({ timeout, waitUntil }) => {
        await page.waitForLoadState(waitUntil, { timeout });
    }
});
```

#### Defined in

[host.ts:125](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L125)

___

### invokeAsyncMethod

▸ **invokeAsyncMethod**(`obj`, `method`, `args?`): `Promise`\<`unknown`\>

Invokes a named method on an object asynchronously, passing the given arguments.
Returns `undefined` if the method does not exist on the object.
Provides a generic way to delegate to any playwright locator by method name.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `obj` | `Object` | `undefined` | The target object to invoke the method on. |
| `method` | `string` | `undefined` | The name of the method to call. |
| `args` | `unknown`[] | `[]` | Arguments to pass to the method. |

#### Returns

`Promise`\<`unknown`\>

The result of the method call, or `undefined` if the method does not exist.

**`Example`**

```ts
async function onLocator({ frame, selector, method, params }) {
   let locator = undefined as playwright.Locator | undefined;
   if (frame)
       locator = await page.frameLocator(frame).locator(selector);
   else
       locator = await page.locator(selector);
   const result = await invokeAsyncMethod(locator, method, params);
   return result;
}
```

#### Defined in

[host.ts:349](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L349)

___

### unwrap

▸ **unwrap**(`obj`): `unknown`

Recursively unwraps extracted values by stripping internal wrapper objects.
Wrapper objects (those with `value` and `nodes` properties) are replaced by their `value`.
Plain objects and arrays are traversed recursively, unwrapping nested values.
Primitives and non-unwrappable values are returned as-is.

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `unknown` |

#### Returns

`unknown`

#### Defined in

[package/lib/unwrap.ts:7](https://github.com/dtempx/syphonx-core/blob/main/package/lib/unwrap.ts#L7)
