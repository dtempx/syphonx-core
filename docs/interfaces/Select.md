[syphonx-core](../README.md) / [Exports](../modules.md) / Select

# Interface: Select

Represents a target for selection operations.

## Hierarchy

- [`SelectTarget`](SelectTarget.md)

  ↳ **`Select`**

## Table of contents

### Properties

- [all](Select.md#all)
- [collate](Select.md#collate)
- [comment](Select.md#comment)
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
- [waitfor](Select.md#waitfor)
- [when](Select.md#when)

## Properties

### all

• `Optional` **all**: `boolean`

Includes all query stage hits instead of just the first stage. Default is false.

#### Inherited from

[SelectTarget](SelectTarget.md).[all](SelectTarget.md#all)

#### Defined in

[package/public/Select.ts:26](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L26)

___

### collate

• `Optional` **collate**: `boolean`

Causes the selector to be processed as a single unit rather than for each node or each value.

#### Inherited from

[SelectTarget](SelectTarget.md).[collate](SelectTarget.md#collate)

#### Defined in

[package/public/Select.ts:46](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L46)

___

### comment

• `Optional` **comment**: `string`

An optional comment for the selector.

#### Inherited from

[SelectTarget](SelectTarget.md).[comment](SelectTarget.md#comment)

#### Defined in

[package/public/Select.ts:50](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L50)

___

### context

• `Optional` **context**: ``null`` \| `number`

Sets the context of the selector query. Default is 1. Specify null for global context.

#### Inherited from

[SelectTarget](SelectTarget.md).[context](SelectTarget.md#context)

#### Defined in

[package/public/Select.ts:54](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L54)

___

### distinct

• `Optional` **distinct**: `boolean`

Removes duplicate values from arrays.

#### Inherited from

[SelectTarget](SelectTarget.md).[distinct](SelectTarget.md#distinct)

#### Defined in

[package/public/Select.ts:58](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L58)

___

### format

• `Optional` **format**: [`SelectFormat`](../modules.md#selectformat)

The format of the selection. Default is multiline when type is string.

#### Inherited from

[SelectTarget](SelectTarget.md).[format](SelectTarget.md#format)

#### Defined in

[package/public/Select.ts:38](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L38)

___

### hits

• `Optional` **hits**: ``null`` \| `number`

**`Deprecated`**

Use `all` instead. Limits the number of query stage hits. Default is unlimited or specify null for unlimited.

#### Inherited from

[SelectTarget](SelectTarget.md).[hits](SelectTarget.md#hits)

#### Defined in

[package/public/Select.ts:30](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L30)

___

### limit

• `Optional` **limit**: ``null`` \| `number`

Limits the number of nodes returned by the query. Default is 1 when repeated is false and all is false, otherwise unlimited. Specify null to force unlimited nodes.

#### Inherited from

[SelectTarget](SelectTarget.md).[limit](SelectTarget.md#limit)

#### Defined in

[package/public/Select.ts:34](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L34)

___

### name

• `Optional` **name**: `string`

#### Defined in

[package/public/Select.ts:78](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L78)

___

### negate

• `Optional` **negate**: `boolean`

Negates a boolean result.

#### Inherited from

[SelectTarget](SelectTarget.md).[negate](SelectTarget.md#negate)

#### Defined in

[package/public/Select.ts:62](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L62)

___

### pattern

• `Optional` **pattern**: `string`

A validation pattern. Only applies if type is string.

#### Inherited from

[SelectTarget](SelectTarget.md).[pattern](SelectTarget.md#pattern)

#### Defined in

[package/public/Select.ts:42](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L42)

___

### pivot

• `Optional` **pivot**: [`SelectTarget`](SelectTarget.md)

A pivot target for the selection.

#### Inherited from

[SelectTarget](SelectTarget.md).[pivot](SelectTarget.md#pivot)

#### Defined in

[package/public/Select.ts:14](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L14)

___

### query

• `Optional` **query**: [`SelectQuery`](../modules.md#selectquery)[]

An array of queries to be executed.

#### Inherited from

[SelectTarget](SelectTarget.md).[query](SelectTarget.md#query)

#### Defined in

[package/public/Select.ts:10](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L10)

___

### removeNulls

• `Optional` **removeNulls**: `boolean`

Removes null values from arrays.

#### Inherited from

[SelectTarget](SelectTarget.md).[removeNulls](SelectTarget.md#removenulls)

#### Defined in

[package/public/Select.ts:66](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L66)

___

### repeated

• `Optional` **repeated**: `boolean`

#### Defined in

[package/public/Select.ts:79](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L79)

___

### required

• `Optional` **required**: `boolean`

#### Defined in

[package/public/Select.ts:80](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L80)

___

### select

• `Optional` **select**: [`Select`](Select.md)[]

An array of sub-selections to be executed.

#### Inherited from

[SelectTarget](SelectTarget.md).[select](SelectTarget.md#select)

#### Defined in

[package/public/Select.ts:18](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L18)

___

### type

• `Optional` **type**: [`SelectType`](../modules.md#selecttype)

#### Defined in

[package/public/Select.ts:81](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L81)

___

### union

• `Optional` **union**: [`SelectTarget`](SelectTarget.md)[]

#### Defined in

[package/public/Select.ts:82](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L82)

___

### value

• `Optional` **value**: `unknown`

A value to be used in the selection. Executes after query if both are used.

#### Inherited from

[SelectTarget](SelectTarget.md).[value](SelectTarget.md#value)

#### Defined in

[package/public/Select.ts:22](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L22)

___

### waitfor

• `Optional` **waitfor**: `boolean`

Waits for the selector to appear when loading the page.

#### Inherited from

[SelectTarget](SelectTarget.md).[waitfor](SelectTarget.md#waitfor)

#### Defined in

[package/public/Select.ts:70](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L70)

___

### when

• `Optional` **when**: `string`

A condition that must be met for the selection to occur. SKIPPED actions indicate an unmet condition, BYPASSED actions indicate unexecuted actions in offline mode.

#### Inherited from

[SelectTarget](SelectTarget.md).[when](SelectTarget.md#when)

#### Defined in

[package/public/Select.ts:74](https://github.com/dtempx/syphonx-core/blob/bfef688/package/public/Select.ts#L74)
