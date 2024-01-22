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

template.ts:8

___

### debug

• `Optional` **debug**: `boolean`

#### Defined in

template.ts:13

___

### headers

• `Optional` **headers**: `Record`<`string`, `string`\>

#### Defined in

template.ts:15

___

### params

• `Optional` **params**: `Record`<`string`, `unknown`\>

#### Defined in

template.ts:11

___

### timeout

• `Optional` **timeout**: `number`

Timeout interval in seconds for page navigation, reload, and goback.

#### Defined in

template.ts:17

___

### unpatch

• `Optional` **unpatch**: `string`[]

#### Defined in

template.ts:18

___

### url

• `Optional` **url**: `string`

Default URL for the template. Can be overridden by various means.

#### Defined in

template.ts:10

___

### useragent

• `Optional` **useragent**: `string`

#### Defined in

template.ts:14

___

### vars

• `Optional` **vars**: `Record`<`string`, `unknown`\>

#### Defined in

template.ts:12

___

### viewport

• `Optional` **viewport**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `height` | `number` |
| `width` | `number` |

#### Defined in

template.ts:19

___

### waitUntil

• `Optional` **waitUntil**: [`DocumentLoadState`](../modules.md#documentloadstate)

#### Defined in

template.ts:20
