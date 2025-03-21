[syphonx-core](../README.md) / [Exports](../modules.md) / HostOptions

# Interface: HostOptions

## Table of contents

### Properties

- [debug](HostOptions.md#debug)
- [extractHtml](HostOptions.md#extracthtml)
- [maxYields](HostOptions.md#maxyields)
- [onExtract](HostOptions.md#onextract)
- [onGoback](HostOptions.md#ongoback)
- [onHtml](HostOptions.md#onhtml)
- [onLocator](HostOptions.md#onlocator)
- [onNavigate](HostOptions.md#onnavigate)
- [onReload](HostOptions.md#onreload)
- [onScreenshot](HostOptions.md#onscreenshot)
- [onYield](HostOptions.md#onyield)
- [params](HostOptions.md#params)
- [retries](HostOptions.md#retries)
- [retryDelay](HostOptions.md#retrydelay)
- [template](HostOptions.md#template)
- [unwrap](HostOptions.md#unwrap)
- [url](HostOptions.md#url)

## Properties

### debug

• `Optional` **debug**: `boolean`

#### Defined in

[host.ts:40](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L40)

___

### extractHtml

• `Optional` **extractHtml**: `boolean`

#### Defined in

[host.ts:41](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L41)

___

### maxYields

• `Optional` **maxYields**: `number`

#### Defined in

[host.ts:42](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L42)

___

### onExtract

• `Optional` **onExtract**: (`state`: [`ExtractState`](ExtractState.md), `script`: `string`) => `Promise`\<[`ExtractState`](ExtractState.md)\>

#### Type declaration

▸ (`state`, `script`): `Promise`\<[`ExtractState`](ExtractState.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ExtractState`](ExtractState.md) |
| `script` | `string` |

##### Returns

`Promise`\<[`ExtractState`](ExtractState.md)\>

#### Defined in

[host.ts:45](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L45)

___

### onGoback

• `Optional` **onGoback**: (`options`: \{ `timeout?`: `number` ; `waitUntil?`: [`DocumentLoadState`](../modules.md#documentloadstate)  }) => `Promise`\<[`NavigateResult`](NavigateResult.md)\>

#### Type declaration

▸ (`options`): `Promise`\<[`NavigateResult`](NavigateResult.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.timeout?` | `number` |
| `options.waitUntil?` | [`DocumentLoadState`](../modules.md#documentloadstate) |

##### Returns

`Promise`\<[`NavigateResult`](NavigateResult.md)\>

#### Defined in

[host.ts:46](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L46)

___

### onHtml

• `Optional` **onHtml**: () => `Promise`\<`string`\>

#### Type declaration

▸ (): `Promise`\<`string`\>

##### Returns

`Promise`\<`string`\>

#### Defined in

[host.ts:47](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L47)

___

### onLocator

• `Optional` **onLocator**: (`options`: [`YieldLocator`](YieldLocator.md)) => `Promise`\<`unknown`\>

#### Type declaration

▸ (`options`): `Promise`\<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`YieldLocator`](YieldLocator.md) |

##### Returns

`Promise`\<`unknown`\>

#### Defined in

[host.ts:48](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L48)

___

### onNavigate

• `Optional` **onNavigate**: (`options`: [`YieldNavigate`](YieldNavigate.md) & \{ `timeout?`: `number` ; `waitUntil?`: [`DocumentLoadState`](../modules.md#documentloadstate)  }) => `Promise`\<[`NavigateResult`](NavigateResult.md)\>

#### Type declaration

▸ (`options`): `Promise`\<[`NavigateResult`](NavigateResult.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`YieldNavigate`](YieldNavigate.md) & \{ `timeout?`: `number` ; `waitUntil?`: [`DocumentLoadState`](../modules.md#documentloadstate)  } |

##### Returns

`Promise`\<[`NavigateResult`](NavigateResult.md)\>

#### Defined in

[host.ts:49](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L49)

___

### onReload

• `Optional` **onReload**: (`options`: \{ `timeout?`: `number` ; `waitUntil?`: [`DocumentLoadState`](../modules.md#documentloadstate)  }) => `Promise`\<[`NavigateResult`](NavigateResult.md)\>

#### Type declaration

▸ (`options`): `Promise`\<[`NavigateResult`](NavigateResult.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.timeout?` | `number` |
| `options.waitUntil?` | [`DocumentLoadState`](../modules.md#documentloadstate) |

##### Returns

`Promise`\<[`NavigateResult`](NavigateResult.md)\>

#### Defined in

[host.ts:50](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L50)

___

### onScreenshot

• `Optional` **onScreenshot**: (`options`: [`YieldScreenshot`](YieldScreenshot.md)) => `Promise`\<`void`\>

#### Type declaration

▸ (`options`): `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`YieldScreenshot`](YieldScreenshot.md) |

##### Returns

`Promise`\<`void`\>

#### Defined in

[host.ts:51](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L51)

___

### onYield

• `Optional` **onYield**: (`params`: [`YieldParams`](YieldParams.md)) => `Promise`\<`void`\>

#### Type declaration

▸ (`params`): `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`YieldParams`](YieldParams.md) |

##### Returns

`Promise`\<`void`\>

#### Defined in

[host.ts:52](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L52)

___

### params

• `Optional` **params**: `Record`\<`string`, `unknown`\>

#### Defined in

[host.ts:38](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L38)

___

### retries

• `Optional` **retries**: `number`

#### Defined in

[host.ts:43](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L43)

___

### retryDelay

• `Optional` **retryDelay**: `number`[]

#### Defined in

[host.ts:44](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L44)

___

### template

• **template**: [`Template`](Template.md)

#### Defined in

[host.ts:36](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L36)

___

### unwrap

• `Optional` **unwrap**: `boolean`

#### Defined in

[host.ts:39](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L39)

___

### url

• `Optional` **url**: `string`

#### Defined in

[host.ts:37](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/host.ts#L37)
