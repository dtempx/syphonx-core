[syphonx-core](../README.md) / [Exports](../modules.md) / Select

# Interface: Select

## Hierarchy

- [`SelectTarget`](SelectTarget.md)

  ↳ **`Select`**

## Table of contents

### Properties

- [all](Select.md#all)
- [collate](Select.md#collate)
- [context](Select.md#context)
- [distinct](Select.md#distinct)
- [format](Select.md#format)
- [hits](Select.md#hits)
- [limit](Select.md#limit)
- [name](Select.md#name)
- [negate](Select.md#negate)
- [pattern](Select.md#pattern)
- [pivot](Select.md#pivot)
- [query](Select.md#query)
- [removeNulls](Select.md#removenulls)
- [repeated](Select.md#repeated)
- [required](Select.md#required)
- [select](Select.md#select)
- [type](Select.md#type)
- [union](Select.md#union)
- [value](Select.md#value)
- [when](Select.md#when)

## Properties

### all

• `Optional` **all**: `boolean`

#### Inherited from

[SelectTarget](SelectTarget.md).[all](SelectTarget.md#all)

#### Defined in

[package/public/Select.ts:8](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L8)

___

### collate

• `Optional` **collate**: `boolean`

#### Inherited from

[SelectTarget](SelectTarget.md).[collate](SelectTarget.md#collate)

#### Defined in

[package/public/Select.ts:17](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L17)

___

### context

• `Optional` **context**: ``null`` \| `number`

#### Inherited from

[SelectTarget](SelectTarget.md).[context](SelectTarget.md#context)

#### Defined in

[package/public/Select.ts:18](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L18)

___

### distinct

• `Optional` **distinct**: `boolean`

#### Inherited from

[SelectTarget](SelectTarget.md).[distinct](SelectTarget.md#distinct)

#### Defined in

[package/public/Select.ts:19](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L19)

___

### format

• `Optional` **format**: [`SelectFormat`](../modules.md#selectformat)

#### Inherited from

[SelectTarget](SelectTarget.md).[format](SelectTarget.md#format)

#### Defined in

[package/public/Select.ts:15](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L15)

___

### hits

• `Optional` **hits**: ``null`` \| `number`

#### Inherited from

[SelectTarget](SelectTarget.md).[hits](SelectTarget.md#hits)

#### Defined in

[package/public/Select.ts:13](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L13)

___

### limit

• `Optional` **limit**: ``null`` \| `number`

#### Inherited from

[SelectTarget](SelectTarget.md).[limit](SelectTarget.md#limit)

#### Defined in

[package/public/Select.ts:14](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L14)

___

### name

• `Optional` **name**: `string`

#### Defined in

[package/public/Select.ts:26](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L26)

___

### negate

• `Optional` **negate**: `boolean`

#### Inherited from

[SelectTarget](SelectTarget.md).[negate](SelectTarget.md#negate)

#### Defined in

[package/public/Select.ts:20](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L20)

___

### pattern

• `Optional` **pattern**: `string`

#### Inherited from

[SelectTarget](SelectTarget.md).[pattern](SelectTarget.md#pattern)

#### Defined in

[package/public/Select.ts:16](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L16)

___

### pivot

• `Optional` **pivot**: [`SelectTarget`](SelectTarget.md)

#### Inherited from

[SelectTarget](SelectTarget.md).[pivot](SelectTarget.md#pivot)

#### Defined in

[package/public/Select.ts:5](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L5)

___

### query

• `Optional` **query**: [`SelectQuery`](../modules.md#selectquery)[]

#### Inherited from

[SelectTarget](SelectTarget.md).[query](SelectTarget.md#query)

#### Defined in

[package/public/Select.ts:4](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L4)

___

### removeNulls

• `Optional` **removeNulls**: `boolean`

#### Inherited from

[SelectTarget](SelectTarget.md).[removeNulls](SelectTarget.md#removenulls)

#### Defined in

[package/public/Select.ts:21](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L21)

___

### repeated

• `Optional` **repeated**: `boolean`

#### Defined in

[package/public/Select.ts:27](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L27)

___

### required

• `Optional` **required**: `boolean`

#### Defined in

[package/public/Select.ts:28](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L28)

___

### select

• `Optional` **select**: [`Select`](Select.md)[]

#### Inherited from

[SelectTarget](SelectTarget.md).[select](SelectTarget.md#select)

#### Defined in

[package/public/Select.ts:6](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L6)

___

### type

• `Optional` **type**: [`SelectType`](../modules.md#selecttype)

#### Defined in

[package/public/Select.ts:29](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L29)

___

### union

• `Optional` **union**: [`SelectTarget`](SelectTarget.md)[]

#### Defined in

[package/public/Select.ts:30](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L30)

___

### value

• `Optional` **value**: `unknown`

#### Inherited from

[SelectTarget](SelectTarget.md).[value](SelectTarget.md#value)

#### Defined in

[package/public/Select.ts:7](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L7)

___

### when

• `Optional` **when**: `string`

#### Inherited from

[SelectTarget](SelectTarget.md).[when](SelectTarget.md#when)

#### Defined in

[package/public/Select.ts:22](https://github.com/dtempx/syphonx-core/blob/1111902/package/public/Select.ts#L22)
