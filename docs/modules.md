[Documentation](README.md) / Exports

# Documentation

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
- [GoBack](interfaces/GoBack.md)
- [HostOptions](interfaces/HostOptions.md)
- [Locator](interfaces/Locator.md)
- [Navigate](interfaces/Navigate.md)
- [NavigateResult](interfaces/NavigateResult.md)
- [Reload](interfaces/Reload.md)
- [Repeat](interfaces/Repeat.md)
- [Screenshot](interfaces/Screenshot.md)
- [Scroll](interfaces/Scroll.md)
- [Select](interfaces/Select.md)
- [SelectTarget](interfaces/SelectTarget.md)
- [Switch](interfaces/Switch.md)
- [Template](interfaces/Template.md)
- [Transform](interfaces/Transform.md)
- [WaitFor](interfaces/WaitFor.md)
- [Yield](interfaces/Yield.md)
- [YieldLocator](interfaces/YieldLocator.md)
- [YieldNavigate](interfaces/YieldNavigate.md)
- [YieldParams](interfaces/YieldParams.md)
- [YieldScreenshot](interfaces/YieldScreenshot.md)
- [YieldState](interfaces/YieldState.md)

### Type Aliases

- [Action](modules.md#action)
- [BreakAction](modules.md#breakaction)
- [ClickAction](modules.md#clickaction)
- [DocumentLoadState](modules.md#documentloadstate)
- [EachAction](modules.md#eachaction)
- [ErrorAction](modules.md#erroraction)
- [ExtractErrorCode](modules.md#extracterrorcode)
- [GoBackAction](modules.md#gobackaction)
- [LocatorAction](modules.md#locatoraction)
- [LocatorMethod](modules.md#locatormethod)
- [NavigateAction](modules.md#navigateaction)
- [ReloadAction](modules.md#reloadaction)
- [RepeatAction](modules.md#repeataction)
- [ScreenshotAction](modules.md#screenshotaction)
- [ScrollAction](modules.md#scrollaction)
- [ScrollTarget](modules.md#scrolltarget)
- [SelectAction](modules.md#selectaction)
- [SelectFormat](modules.md#selectformat)
- [SelectOn](modules.md#selecton)
- [SelectQuery](modules.md#selectquery)
- [SelectQueryOp](modules.md#selectqueryop)
- [SelectQueryOperand](modules.md#selectqueryoperand)
- [SelectQueryOperator](modules.md#selectqueryoperator)
- [SelectType](modules.md#selecttype)
- [Snooze](modules.md#snooze)
- [SnoozeAction](modules.md#snoozeaction)
- [SnoozeInterval](modules.md#snoozeinterval)
- [SnoozeMode](modules.md#snoozemode)
- [SwitchAction](modules.md#switchaction)
- [TransformAction](modules.md#transformaction)
- [WaitForAction](modules.md#waitforaction)
- [When](modules.md#when)
- [YieldAction](modules.md#yieldaction)

### Variables

- [script](modules.md#script)

### Functions

- [evaluateFormula](modules.md#evaluateformula)
- [extract](modules.md#extract)
- [host](modules.md#host)
- [invokeAsyncMethod](modules.md#invokeasyncmethod)
- [select](modules.md#select)
- [unwrap](modules.md#unwrap)

## Type Aliases

### Action

Ƭ **Action**: [`BreakAction`](modules.md#breakaction) \| [`ClickAction`](modules.md#clickaction) \| [`EachAction`](modules.md#eachaction) \| [`ErrorAction`](modules.md#erroraction) \| [`GoBackAction`](modules.md#gobackaction) \| [`LocatorAction`](modules.md#locatoraction) \| [`NavigateAction`](modules.md#navigateaction) \| [`ReloadAction`](modules.md#reloadaction) \| [`RepeatAction`](modules.md#repeataction) \| [`ScreenshotAction`](modules.md#screenshotaction) \| [`ScrollAction`](modules.md#scrollaction) \| [`SelectAction`](modules.md#selectaction) \| [`SnoozeAction`](modules.md#snoozeaction) \| [`SwitchAction`](modules.md#switchaction) \| [`TransformAction`](modules.md#transformaction) \| [`WaitForAction`](modules.md#waitforaction) \| [`YieldAction`](modules.md#yieldaction)

#### Defined in

[extract/public/Action.ts:19](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L19)

___

### BreakAction

Ƭ **BreakAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `break` | [`Break`](interfaces/Break.md) |

#### Defined in

[extract/public/Action.ts:38](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L38)

___

### ClickAction

Ƭ **ClickAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `click` | [`Click`](interfaces/Click.md) |

#### Defined in

[extract/public/Action.ts:39](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L39)

___

### DocumentLoadState

Ƭ **DocumentLoadState**: ``"load"`` \| ``"domcontentloaded"`` \| ``"networkidle"``

#### Defined in

[extract/public/DocumentLoadState.ts:1](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/DocumentLoadState.ts#L1)

___

### EachAction

Ƭ **EachAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `each` | [`Each`](interfaces/Each.md) |

#### Defined in

[extract/public/Action.ts:40](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L40)

___

### ErrorAction

Ƭ **ErrorAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | [`Error`](interfaces/Error.md) |

#### Defined in

[extract/public/Action.ts:41](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L41)

___

### ExtractErrorCode

Ƭ **ExtractErrorCode**: ``"app-error"`` \| ``"click-timeout"`` \| ``"click-required"`` \| ``"error-limit"`` \| ``"eval-error"`` \| ``"external-error"`` \| ``"fatal-error"`` \| ``"invalid-select"`` \| ``"invalid-operator"`` \| ``"invalid-operand"`` \| ``"select-required"`` \| ``"waitfor-timeout"``

#### Defined in

[extract/public/ExtractErrorCode.ts:1](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/ExtractErrorCode.ts#L1)

___

### GoBackAction

Ƭ **GoBackAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `goback` | [`GoBack`](interfaces/GoBack.md) |

#### Defined in

[extract/public/Action.ts:42](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L42)

___

### LocatorAction

Ƭ **LocatorAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `locator` | [`Locator`](interfaces/Locator.md)[] |

#### Defined in

[extract/public/Action.ts:43](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L43)

___

### LocatorMethod

Ƭ **LocatorMethod**: `string`

#### Defined in

[extract/public/Locator.ts:14](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Locator.ts#L14)

___

### NavigateAction

Ƭ **NavigateAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `navigate` | [`Navigate`](interfaces/Navigate.md) |

#### Defined in

[extract/public/Action.ts:44](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L44)

___

### ReloadAction

Ƭ **ReloadAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reload` | [`Reload`](interfaces/Reload.md) |

#### Defined in

[extract/public/Action.ts:45](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L45)

___

### RepeatAction

Ƭ **RepeatAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `repeat` | [`Repeat`](interfaces/Repeat.md) |

#### Defined in

[extract/public/Action.ts:46](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L46)

___

### ScreenshotAction

Ƭ **ScreenshotAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `screenshot` | [`Screenshot`](interfaces/Screenshot.md) |

#### Defined in

[extract/public/Action.ts:47](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L47)

___

### ScrollAction

Ƭ **ScrollAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `scroll` | [`Scroll`](interfaces/Scroll.md) |

#### Defined in

[extract/public/Action.ts:48](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L48)

___

### ScrollTarget

Ƭ **ScrollTarget**: ``"top"`` \| ``"bottom"``

#### Defined in

[extract/public/Scroll.ts:14](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Scroll.ts#L14)

___

### SelectAction

Ƭ **SelectAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `select` | [`Select`](interfaces/Select.md)[] |

#### Defined in

[extract/public/Action.ts:49](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L49)

___

### SelectFormat

Ƭ **SelectFormat**: ``"href"`` \| ``"multiline"`` \| ``"singleline"`` \| ``"innertext"`` \| ``"textcontent"`` \| ``"none"``

#### Defined in

[extract/public/Select.ts:38](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Select.ts#L38)

___

### SelectOn

Ƭ **SelectOn**: ``"any"`` \| ``"all"`` \| ``"none"``

#### Defined in

[extract/public/Select.ts:39](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Select.ts#L39)

___

### SelectQuery

Ƭ **SelectQuery**: [`string`, ...SelectQueryOp[]]

#### Defined in

[extract/public/Select.ts:34](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Select.ts#L34)

___

### SelectQueryOp

Ƭ **SelectQueryOp**: [`string`, ...unknown[]]

#### Defined in

[extract/public/Select.ts:35](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Select.ts#L35)

___

### SelectQueryOperand

Ƭ **SelectQueryOperand**: `unknown`

#### Defined in

[extract/public/Select.ts:37](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Select.ts#L37)

___

### SelectQueryOperator

Ƭ **SelectQueryOperator**: `string`

#### Defined in

[extract/public/Select.ts:36](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Select.ts#L36)

___

### SelectType

Ƭ **SelectType**: ``"string"`` \| ``"number"`` \| ``"boolean"`` \| ``"object"``

#### Defined in

[extract/public/Select.ts:33](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Select.ts#L33)

___

### Snooze

Ƭ **Snooze**: [`number`, `number`]

#### Defined in

[extract/public/Snooze.ts:1](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Snooze.ts#L1)

___

### SnoozeAction

Ƭ **SnoozeAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `snooze` | [`Snooze`](modules.md#snooze) |

#### Defined in

[extract/public/Action.ts:50](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L50)

___

### SnoozeInterval

Ƭ **SnoozeInterval**: [`number`, `number`] \| [`number`, `number`, [`SnoozeMode`](modules.md#snoozemode)]

#### Defined in

[extract/public/Snooze.ts:3](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Snooze.ts#L3)

___

### SnoozeMode

Ƭ **SnoozeMode**: ``"before"`` \| ``"after"`` \| ``"before-and-after"``

#### Defined in

[extract/public/Snooze.ts:2](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Snooze.ts#L2)

___

### SwitchAction

Ƭ **SwitchAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `switch` | [`Switch`](interfaces/Switch.md)[] |

#### Defined in

[extract/public/Action.ts:51](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L51)

___

### TransformAction

Ƭ **TransformAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transform` | [`Transform`](interfaces/Transform.md)[] |

#### Defined in

[extract/public/Action.ts:52](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L52)

___

### WaitForAction

Ƭ **WaitForAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `waitfor` | [`WaitFor`](interfaces/WaitFor.md) |

#### Defined in

[extract/public/Action.ts:53](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L53)

___

### When

Ƭ **When**: `string`

#### Defined in

[extract/public/When.ts:1](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/When.ts#L1)

___

### YieldAction

Ƭ **YieldAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `yield` | [`Yield`](interfaces/Yield.md) |

#### Defined in

[extract/public/Action.ts:54](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/public/Action.ts#L54)

## Variables

### script

• `Const` **script**: ``""``

#### Defined in

[host.ts:220](https://github.com/dtempx/syphonx-core/blob/20fc1c8/host.ts#L220)

## Functions

### evaluateFormula

▸ **evaluateFormula**(`formula`, `scope?`): `unknown`

Evaluates a Javascript formula within the specified scope returning a computed result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `formula` | `string` | A Javascript formula to evaluate. |
| `scope` | `Record`<`string`, `unknown`\> | Object state defining the scope of the evaluation. |

#### Returns

`unknown`

The result of the formula evaluation.

#### Defined in

[lib/formula.ts:7](https://github.com/dtempx/syphonx-core/blob/20fc1c8/lib/formula.ts#L7)

___

### extract

▸ **extract**(`state`): `Promise`<[`ExtractState`](interfaces/ExtractState.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ExtractState`](interfaces/ExtractState.md) |

#### Returns

`Promise`<[`ExtractState`](interfaces/ExtractState.md)\>

#### Defined in

[extract/extract.ts:5](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/extract.ts#L5)

___

### host

▸ **host**(`«destructured»`): `Promise`<[`ExtractResult`](interfaces/ExtractResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`HostOptions`](interfaces/HostOptions.md) |

#### Returns

`Promise`<[`ExtractResult`](interfaces/ExtractResult.md)\>

#### Defined in

[host.ts:54](https://github.com/dtempx/syphonx-core/blob/20fc1c8/host.ts#L54)

___

### invokeAsyncMethod

▸ **invokeAsyncMethod**(`obj`, `method`, `args?`): `Promise`<`unknown`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `obj` | `Object` | `undefined` |
| `method` | `string` | `undefined` |
| `args` | `unknown`[] | `[]` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[host.ts:181](https://github.com/dtempx/syphonx-core/blob/20fc1c8/host.ts#L181)

___

### select

▸ **select**(`selects`, `options?`): [`ExtractState`](interfaces/ExtractState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `selects` | [`Select`](interfaces/Select.md)[] |
| `options` | `SelectOptions` |

#### Returns

[`ExtractState`](interfaces/ExtractState.md)

#### Defined in

[extract/select.ts:12](https://github.com/dtempx/syphonx-core/blob/20fc1c8/extract/select.ts#L12)

___

### unwrap

▸ **unwrap**(`obj`): `unknown`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `unknown` |

#### Returns

`unknown`

#### Defined in

[lib/unwrap.ts:1](https://github.com/dtempx/syphonx-core/blob/20fc1c8/lib/unwrap.ts#L1)
