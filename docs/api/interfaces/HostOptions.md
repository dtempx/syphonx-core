[syphonx-core](../README.md) / HostOptions

# Interface: HostOptions

Configuration options for the [host](../README.md#host) function.

Provides the extraction template, runtime parameters, and callback hooks that
the host environment (e.g. Playwright) implements to perform browser actions
on behalf of the extraction engine.

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

Enables verbose debug logging in the extraction engine.

#### Defined in

[host.ts:54](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L54)

___

### extractHtml

• `Optional` **extractHtml**: `boolean`

When true, captures the page HTML after extraction via the [HostOptions.onHtml](HostOptions.md#onhtml) callback.

#### Defined in

[host.ts:56](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L56)

___

### maxYields

• `Optional` **maxYields**: `number`

Maximum number of yield/re-enter cycles before the host loop terminates. Defaults to 1000.

#### Defined in

[host.ts:58](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L58)

___

### onExtract

• `Optional` **onExtract**: (`state`: [`ExtractState`](ExtractState.md), `script`: `string`) => `Promise`\<[`ExtractState`](ExtractState.md)\>

Callback to inject and execute the extraction engine script inside the browser, returning the updated state.

#### Type declaration

▸ (`state`, `script`): `Promise`\<[`ExtractState`](ExtractState.md)\>

Callback to inject and execute the extraction engine script inside the browser, returning the updated state.

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ExtractState`](ExtractState.md) |
| `script` | `string` |

##### Returns

`Promise`\<[`ExtractState`](ExtractState.md)\>

#### Defined in

[host.ts:64](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L64)

___

### onGoback

• `Optional` **onGoback**: (`options`: \{ `timeout?`: `number` ; `waitUntil?`: [`DocumentLoadState`](../README.md#documentloadstate)  }) => `Promise`\<[`NavigateResult`](NavigateResult.md)\>

Callback to navigate the browser back in history.

#### Type declaration

▸ (`options`): `Promise`\<[`NavigateResult`](NavigateResult.md)\>

Callback to navigate the browser back in history.

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.timeout?` | `number` |
| `options.waitUntil?` | [`DocumentLoadState`](../README.md#documentloadstate) |

##### Returns

`Promise`\<[`NavigateResult`](NavigateResult.md)\>

#### Defined in

[host.ts:66](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L66)

___

### onHtml

• `Optional` **onHtml**: () => `Promise`\<`string`\>

Callback to retrieve the current page's serialized HTML.

#### Type declaration

▸ (): `Promise`\<`string`\>

Callback to retrieve the current page's serialized HTML.

##### Returns

`Promise`\<`string`\>

#### Defined in

[host.ts:68](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L68)

___

### onLocator

• `Optional` **onLocator**: (`options`: [`YieldLocator`](YieldLocator.md)) => `Promise`\<`unknown`\>

Callback to execute a Playwright locator operation and return its result.

#### Type declaration

▸ (`options`): `Promise`\<`unknown`\>

Callback to execute a Playwright locator operation and return its result.

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`YieldLocator`](YieldLocator.md) |

##### Returns

`Promise`\<`unknown`\>

#### Defined in

[host.ts:70](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L70)

___

### onNavigate

• `Optional` **onNavigate**: (`options`: [`YieldNavigate`](YieldNavigate.md) & \{ `timeout?`: `number` ; `waitUntil?`: [`DocumentLoadState`](../README.md#documentloadstate)  }) => `Promise`\<[`NavigateResult`](NavigateResult.md)\>

Callback to navigate the browser to a URL. Required.

#### Type declaration

▸ (`options`): `Promise`\<[`NavigateResult`](NavigateResult.md)\>

Callback to navigate the browser to a URL. Required.

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`YieldNavigate`](YieldNavigate.md) & \{ `timeout?`: `number` ; `waitUntil?`: [`DocumentLoadState`](../README.md#documentloadstate)  } |

##### Returns

`Promise`\<[`NavigateResult`](NavigateResult.md)\>

#### Defined in

[host.ts:72](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L72)

___

### onReload

• `Optional` **onReload**: (`options`: \{ `timeout?`: `number` ; `waitUntil?`: [`DocumentLoadState`](../README.md#documentloadstate)  }) => `Promise`\<[`NavigateResult`](NavigateResult.md)\>

Callback to reload the current page.

#### Type declaration

▸ (`options`): `Promise`\<[`NavigateResult`](NavigateResult.md)\>

Callback to reload the current page.

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.timeout?` | `number` |
| `options.waitUntil?` | [`DocumentLoadState`](../README.md#documentloadstate) |

##### Returns

`Promise`\<[`NavigateResult`](NavigateResult.md)\>

#### Defined in

[host.ts:74](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L74)

___

### onScreenshot

• `Optional` **onScreenshot**: (`options`: [`YieldScreenshot`](YieldScreenshot.md)) => `Promise`\<`void`\>

Callback to capture a screenshot of the page or a specific element.

#### Type declaration

▸ (`options`): `Promise`\<`void`\>

Callback to capture a screenshot of the page or a specific element.

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`YieldScreenshot`](YieldScreenshot.md) |

##### Returns

`Promise`\<`void`\>

#### Defined in

[host.ts:76](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L76)

___

### onYield

• `Optional` **onYield**: (`params`: [`YieldParams`](YieldParams.md)) => `Promise`\<`void`\>

Callback invoked for generic yield operations (e.g. waiting for a document load state).

#### Type declaration

▸ (`params`): `Promise`\<`void`\>

Callback invoked for generic yield operations (e.g. waiting for a document load state).

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`YieldParams`](YieldParams.md) |

##### Returns

`Promise`\<`void`\>

#### Defined in

[host.ts:78](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L78)

___

### params

• `Optional` **params**: `Record`\<`string`, `unknown`\>

Runtime parameters merged on top of `template.params`. Used in formula evaluation and URL expansion.

#### Defined in

[host.ts:50](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L50)

___

### retries

• `Optional` **retries**: `number`

Number of retry attempts for retryable errors (e.g. target closed, navigation, timeout).

#### Defined in

[host.ts:60](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L60)

___

### retryDelay

• `Optional` **retryDelay**: `number`[]

Delay in seconds between successive retries. Each element corresponds to a retry attempt.

#### Defined in

[host.ts:62](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L62)

___

### template

• **template**: [`Template`](Template.md)

The extraction template defining actions, selectors, and settings.

#### Defined in

[host.ts:46](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L46)

___

### unwrap

• `Optional` **unwrap**: `boolean`

When true, unwraps single-element arrays and single-property objects in the final result data.

#### Defined in

[host.ts:52](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L52)

___

### url

• `Optional` **url**: `string`

URL to navigate to. Overrides `template.url` when provided. Supports formula expansion.

#### Defined in

[host.ts:48](https://github.com/dtempx/syphonx-core/blob/main/host.ts#L48)
