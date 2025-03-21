[syphonx-core](../README.md) / [Exports](../modules.md) / Template

# Interface: Template

Represents a SyphonX template.

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

Set of actions performed by the template.

#### Defined in

[template.ts:8](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L8)

___

### debug

• `Optional` **debug**: `boolean`

#### Defined in

[template.ts:13](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L13)

___

### headers

• `Optional` **headers**: `Record`\<`string`, `string`\>

#### Defined in

[template.ts:15](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L15)

___

### params

• `Optional` **params**: `Record`\<`string`, `unknown`\>

#### Defined in

[template.ts:11](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L11)

___

### timeout

• `Optional` **timeout**: `number`

Timeout interval in seconds for page navigation, reload, and goback.

#### Defined in

[template.ts:17](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L17)

___

### unpatch

• `Optional` **unpatch**: `string`[]

#### Defined in

[template.ts:18](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L18)

___

### url

• `Optional` **url**: `string`

Default URL for the template. Can be overridden by various means.

#### Defined in

[template.ts:10](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L10)

___

### useragent

• `Optional` **useragent**: `string`

#### Defined in

[template.ts:14](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L14)

___

### vars

• `Optional` **vars**: `Record`\<`string`, `unknown`\>

#### Defined in

[template.ts:12](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L12)

___

### viewport

• `Optional` **viewport**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `height` | `number` |
| `width` | `number` |

#### Defined in

[template.ts:19](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L19)

___

### waitUntil

• `Optional` **waitUntil**: [`DocumentLoadState`](../modules.md#documentloadstate)

#### Defined in

[template.ts:20](https://github.com/dtempx/syphonx-core/blob/1f6e1bf/template.ts#L20)
