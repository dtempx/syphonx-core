[syphonx-core](README.md) / Exports

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
- [Locator](interfaces/Locator.md)
- [Metrics](interfaces/Metrics.md)
- [Navigate](interfaces/Navigate.md)
- [NavigateResult](interfaces/NavigateResult.md)
- [Reload](interfaces/Reload.md)
- [Repeat](interfaces/Repeat.md)
- [Screenshot](interfaces/Screenshot.md)
- [Scroll](interfaces/Scroll.md)
- [Select](interfaces/Select.md)
- [SelectTarget](interfaces/SelectTarget.md)
- [Snooze](interfaces/Snooze.md)
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
- [ActionType](modules.md#actiontype)
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

- [\_select](modules.md#_select)
- [\_transform](modules.md#_transform)
- [evaluateFormula](modules.md#evaluateformula)
- [extract](modules.md#extract)
- [extractSync](modules.md#extractsync)
- [findAction](modules.md#findaction)
- [findLastSelectGroup](modules.md#findlastselectgroup)
- [findSelect](modules.md#findselect)
- [flattenTemplateActions](modules.md#flattentemplateactions)
- [flattenTemplateSelect](modules.md#flattentemplateselect)
- [flattenTemplateTransforms](modules.md#flattentemplatetransforms)
- [host](modules.md#host)
- [invokeAsyncMethod](modules.md#invokeasyncmethod)
- [unwrap](modules.md#unwrap)

## Type Aliases

### Action

Ƭ **Action**: [`BreakAction`](modules.md#breakaction) \| [`ClickAction`](modules.md#clickaction) \| [`EachAction`](modules.md#eachaction) \| [`ErrorAction`](modules.md#erroraction) \| [`GoBackAction`](modules.md#gobackaction) \| [`LocatorAction`](modules.md#locatoraction) \| [`NavigateAction`](modules.md#navigateaction) \| [`ReloadAction`](modules.md#reloadaction) \| [`RepeatAction`](modules.md#repeataction) \| [`ScreenshotAction`](modules.md#screenshotaction) \| [`ScrollAction`](modules.md#scrollaction) \| [`SelectAction`](modules.md#selectaction) \| [`SnoozeAction`](modules.md#snoozeaction) \| [`SwitchAction`](modules.md#switchaction) \| [`TransformAction`](modules.md#transformaction) \| [`WaitForAction`](modules.md#waitforaction) \| [`YieldAction`](modules.md#yieldaction)

#### Defined in

[package/public/Action.ts:19](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L19)

___

### ActionType

Ƭ **ActionType**: ``"break"`` \| ``"click"`` \| ``"each"`` \| ``"error"`` \| ``"goback"`` \| ``"locator"`` \| ``"navigate"`` \| ``"reload"`` \| ``"repeat"`` \| ``"screenshot"`` \| ``"scroll"`` \| ``"select"`` \| ``"snooze"`` \| ``"switch"`` \| ``"transform"`` \| ``"waitfor"`` \| ``"yield"``

#### Defined in

[package/public/Action.ts:56](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L56)

___

### BreakAction

Ƭ **BreakAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `break` | [`Break`](interfaces/Break.md) |

#### Defined in

[package/public/Action.ts:38](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L38)

___

### ClickAction

Ƭ **ClickAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `click` | [`Click`](interfaces/Click.md) |

#### Defined in

[package/public/Action.ts:39](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L39)

___

### DocumentLoadState

Ƭ **DocumentLoadState**: ``"load"`` \| ``"domcontentloaded"`` \| ``"networkidle"``

#### Defined in

[package/public/DocumentLoadState.ts:1](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/DocumentLoadState.ts#L1)

___

### EachAction

Ƭ **EachAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `each` | [`Each`](interfaces/Each.md) |

#### Defined in

[package/public/Action.ts:40](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L40)

___

### ErrorAction

Ƭ **ErrorAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | [`Error`](interfaces/Error.md) |

#### Defined in

[package/public/Action.ts:41](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L41)

___

### ExtractErrorCode

Ƭ **ExtractErrorCode**: ``"app-error"`` \| ``"click-timeout"`` \| ``"click-required"`` \| ``"error-limit"`` \| ``"eval-error"`` \| ``"external-error"`` \| ``"fatal-error"`` \| ``"host-error"`` \| ``"invalid-select"`` \| ``"invalid-operator"`` \| ``"invalid-operand"`` \| ``"select-required"`` \| ``"waitfor-timeout"``

#### Defined in

[package/public/ExtractErrorCode.ts:1](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/ExtractErrorCode.ts#L1)

___

### GoBackAction

Ƭ **GoBackAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `goback` | [`GoBack`](interfaces/GoBack.md) |

#### Defined in

[package/public/Action.ts:42](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L42)

___

### LocatorAction

Ƭ **LocatorAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `locator` | [`Locator`](interfaces/Locator.md)[] |

#### Defined in

[package/public/Action.ts:43](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L43)

___

### LocatorMethod

Ƭ **LocatorMethod**: `string`

#### Defined in

[package/public/Locator.ts:14](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Locator.ts#L14)

___

### NavigateAction

Ƭ **NavigateAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `navigate` | [`Navigate`](interfaces/Navigate.md) |

#### Defined in

[package/public/Action.ts:44](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L44)

___

### ReloadAction

Ƭ **ReloadAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reload` | [`Reload`](interfaces/Reload.md) |

#### Defined in

[package/public/Action.ts:45](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L45)

___

### RepeatAction

Ƭ **RepeatAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `repeat` | [`Repeat`](interfaces/Repeat.md) |

#### Defined in

[package/public/Action.ts:46](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L46)

___

### ScreenshotAction

Ƭ **ScreenshotAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `screenshot` | [`Screenshot`](interfaces/Screenshot.md) |

#### Defined in

[package/public/Action.ts:47](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L47)

___

### ScrollAction

Ƭ **ScrollAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `scroll` | [`Scroll`](interfaces/Scroll.md) |

#### Defined in

[package/public/Action.ts:48](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L48)

___

### ScrollTarget

Ƭ **ScrollTarget**: ``"top"`` \| ``"bottom"``

#### Defined in

[package/public/Scroll.ts:14](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Scroll.ts#L14)

___

### SelectAction

Ƭ **SelectAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `select` | [`Select`](interfaces/Select.md)[] |

#### Defined in

[package/public/Action.ts:49](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L49)

___

### SelectFormat

Ƭ **SelectFormat**: ``"href"`` \| ``"multiline"`` \| ``"singleline"`` \| ``"innertext"`` \| ``"textcontent"`` \| ``"none"``

#### Defined in

[package/public/Select.ts:38](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L38)

___

### SelectOn

Ƭ **SelectOn**: ``"any"`` \| ``"all"`` \| ``"none"``

#### Defined in

[package/public/Select.ts:39](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L39)

___

### SelectQuery

Ƭ **SelectQuery**: [`string`, ...SelectQueryOp[]]

#### Defined in

[package/public/Select.ts:34](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L34)

___

### SelectQueryOp

Ƭ **SelectQueryOp**: [`string`, ...unknown[]]

#### Defined in

[package/public/Select.ts:35](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L35)

___

### SelectQueryOperand

Ƭ **SelectQueryOperand**: `unknown`

#### Defined in

[package/public/Select.ts:37](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L37)

___

### SelectQueryOperator

Ƭ **SelectQueryOperator**: `string`

#### Defined in

[package/public/Select.ts:36](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L36)

___

### SelectType

Ƭ **SelectType**: ``"string"`` \| ``"number"`` \| ``"boolean"`` \| ``"object"``

#### Defined in

[package/public/Select.ts:33](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L33)

___

### SnoozeAction

Ƭ **SnoozeAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `snooze` | [`Snooze`](interfaces/Snooze.md) \| `number` \| [`number`] \| [`number`, `number`] |

#### Defined in

[package/public/Action.ts:50](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L50)

___

### SnoozeInterval

Ƭ **SnoozeInterval**: [`number`, `number`] \| [`number`, `number`, [`SnoozeMode`](modules.md#snoozemode)]

#### Defined in

[package/public/Snooze.ts:4](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Snooze.ts#L4)

___

### SnoozeMode

Ƭ **SnoozeMode**: ``"before"`` \| ``"after"`` \| ``"before-and-after"``

#### Defined in

[package/public/Snooze.ts:3](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Snooze.ts#L3)

___

### SwitchAction

Ƭ **SwitchAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `switch` | [`Switch`](interfaces/Switch.md)[] |

#### Defined in

[package/public/Action.ts:51](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L51)

___

### TransformAction

Ƭ **TransformAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transform` | [`Transform`](interfaces/Transform.md)[] |

#### Defined in

[package/public/Action.ts:52](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L52)

___

### WaitForAction

Ƭ **WaitForAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `waitfor` | [`WaitFor`](interfaces/WaitFor.md) |

#### Defined in

[package/public/Action.ts:53](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L53)

___

### When

Ƭ **When**: `string`

#### Defined in

[package/public/When.ts:1](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/When.ts#L1)

___

### YieldAction

Ƭ **YieldAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `yield` | [`Yield`](interfaces/Yield.md) |

#### Defined in

[package/public/Action.ts:54](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Action.ts#L54)

## Variables

### script

• `Const` **script**: ``""``

#### Defined in

[host.ts:276](https://github.com/dtempx/syphonx-core/blob/1111902/host.ts#L276)

## Functions

### \_select

▸ **_select**(`selects`, `options?`): [`ExtractState`](interfaces/ExtractState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `selects` | [`Select`](interfaces/Select.md)[] \| [`Template`](interfaces/Template.md) |
| `options` | `SelectOptions` |

#### Returns

[`ExtractState`](interfaces/ExtractState.md)

#### Defined in

[package/select.ts:16](https://github.com/dtempx/syphonx-core/blob/1111902/package/select.ts#L16)

___

### \_transform

▸ **_transform**(`transforms`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transforms` | [`Transform`](interfaces/Transform.md)[] \| [`Template`](interfaces/Template.md) |
| `options` | `TransformOptions` |

#### Returns

`void`

#### Defined in

[package/transform.ts:13](https://github.com/dtempx/syphonx-core/blob/1111902/package/transform.ts#L13)

___

### evaluateFormula

▸ **evaluateFormula**(`formula`, `scope?`): `unknown`

Evaluates a Javascript formula within the specified scope returning a computed result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `formula` | `string` | A Javascript formula to evaluate. |
| `scope` | `Record`\<`string`, `unknown`\> | Object state defining the scope of the evaluation. |

#### Returns

`unknown`

The result of the formula evaluation.

#### Defined in

[package/lib/formula.ts:7](https://github.com/dtempx/syphonx-core/blob/1111902/package/lib/formula.ts#L7)

___

### extract

▸ **extract**(`state`): `Promise`\<[`ExtractState`](interfaces/ExtractState.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ExtractState`](interfaces/ExtractState.md) & \{ `unwrap?`: `boolean`  } |

#### Returns

`Promise`\<[`ExtractState`](interfaces/ExtractState.md)\>

#### Defined in

[package/extract.ts:6](https://github.com/dtempx/syphonx-core/blob/1111902/package/extract.ts#L6)

___

### extractSync

▸ **extractSync**(`state`): [`ExtractState`](interfaces/ExtractState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Partial`\<[`ExtractState`](interfaces/ExtractState.md)\> & \{ `unwrap?`: `boolean`  } |

#### Returns

[`ExtractState`](interfaces/ExtractState.md)

#### Defined in

[package/extract-sync.ts:6](https://github.com/dtempx/syphonx-core/blob/1111902/package/extract-sync.ts#L6)

___

### findAction

▸ **findAction**(`actions`, `action_type`): [`Action`](modules.md#action)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | [`Action`](modules.md#action)[] |
| `action_type` | [`ActionType`](modules.md#actiontype) |

#### Returns

[`Action`](modules.md#action)[]

#### Defined in

[package/utilities.ts:18](https://github.com/dtempx/syphonx-core/blob/1111902/package/utilities.ts#L18)

___

### findLastSelectGroup

▸ **findLastSelectGroup**(`actions`): [`Select`](interfaces/Select.md)[] \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | [`Action`](modules.md#action)[] |

#### Returns

[`Select`](interfaces/Select.md)[] \| `undefined`

#### Defined in

[package/utilities.ts:24](https://github.com/dtempx/syphonx-core/blob/1111902/package/utilities.ts#L24)

___

### findSelect

▸ **findSelect**(`actions`, `name`): [`Select`](interfaces/Select.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | [`Action`](modules.md#action)[] |
| `name` | `string` |

#### Returns

[`Select`](interfaces/Select.md)[]

#### Defined in

[package/utilities.ts:29](https://github.com/dtempx/syphonx-core/blob/1111902/package/utilities.ts#L29)

___

### flattenTemplateActions

▸ **flattenTemplateActions**(`actions`, `result?`, `level?`, `n?`): [`FlatAction`](interfaces/FlatAction.md)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `actions` | [`Action`](modules.md#action)[] | `undefined` |
| `result` | [`FlatAction`](interfaces/FlatAction.md)[] | `[]` |
| `level` | `number` | `0` |
| `n?` | `number` | `undefined` |

#### Returns

[`FlatAction`](interfaces/FlatAction.md)[]

#### Defined in

[package/utilities.ts:39](https://github.com/dtempx/syphonx-core/blob/1111902/package/utilities.ts#L39)

___

### flattenTemplateSelect

▸ **flattenTemplateSelect**(`actions`, `names?`): [`Select`](interfaces/Select.md)[]

Collapses multiple select actions to a single select action.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actions` | [`Action`](modules.md#action)[] | The action tree to collapse. |
| `names?` | `string`[] | Optionally, only collapse the specified names. |

#### Returns

[`Select`](interfaces/Select.md)[]

Returns the collapsed select actions.

#### Defined in

[package/utilities.ts:59](https://github.com/dtempx/syphonx-core/blob/1111902/package/utilities.ts#L59)

___

### flattenTemplateTransforms

▸ **flattenTemplateTransforms**(`actions`): [`Transform`](interfaces/Transform.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `actions` | [`Action`](modules.md#action)[] |

#### Returns

[`Transform`](interfaces/Transform.md)[]

#### Defined in

[package/utilities.ts:74](https://github.com/dtempx/syphonx-core/blob/1111902/package/utilities.ts#L74)

___

### host

▸ **host**(`«destructured»`): `Promise`\<[`ExtractResult`](interfaces/ExtractResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`HostOptions`](interfaces/HostOptions.md) |

#### Returns

`Promise`\<[`ExtractResult`](interfaces/ExtractResult.md)\>

#### Defined in

[host.ts:53](https://github.com/dtempx/syphonx-core/blob/1111902/host.ts#L53)

___

### invokeAsyncMethod

▸ **invokeAsyncMethod**(`obj`, `method`, `args?`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `obj` | `Object` | `undefined` |
| `method` | `string` | `undefined` |
| `args` | `unknown`[] | `[]` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[host.ts:242](https://github.com/dtempx/syphonx-core/blob/1111902/host.ts#L242)

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

[package/lib/unwrap.ts:1](https://github.com/dtempx/syphonx-core/blob/1111902/package/lib/unwrap.ts#L1)
