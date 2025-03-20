[syphonx-core](../README.md) / [Exports](../modules.md) / SelectTarget

# Interface: SelectTarget

Represents a target for selection operations.

## Hierarchy

- **`SelectTarget`**

  ↳ [`Select`](Select.md)

## Table of contents

### Properties

- [all](SelectTarget.md#all)
- [collate](SelectTarget.md#collate)
- [comment](SelectTarget.md#comment)
- [context](SelectTarget.md#context)
- [distinct](SelectTarget.md#distinct)
- [format](SelectTarget.md#format)
- [hits](SelectTarget.md#hits)
- [limit](SelectTarget.md#limit)
- [negate](SelectTarget.md#negate)
- [pattern](SelectTarget.md#pattern)
- [pivot](SelectTarget.md#pivot)
- [query](SelectTarget.md#query)
- [removeNulls](SelectTarget.md#removenulls)
- [select](SelectTarget.md#select)
- [value](SelectTarget.md#value)
- [waitfor](SelectTarget.md#waitfor)
- [when](SelectTarget.md#when)

## Properties

### all

• `Optional` **all**: `boolean`

Includes all query stage hits instead of just the first stage. Default is false.

#### Defined in

[package/public/Select.ts:26](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L26)

___

### collate

• `Optional` **collate**: `boolean`

Causes the selector to be processed as a single unit rather than for each node or each value.

#### Defined in

[package/public/Select.ts:46](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L46)

___

### comment

• `Optional` **comment**: `string`

An optional comment for the selector.

#### Defined in

[package/public/Select.ts:50](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L50)

___

### context

• `Optional` **context**: ``null`` \| `number`

Sets the context of the selector query. Default is 1. Specify null for global context.

#### Defined in

[package/public/Select.ts:54](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L54)

___

### distinct

• `Optional` **distinct**: `boolean`

Removes duplicate values from arrays.

#### Defined in

[package/public/Select.ts:58](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L58)

___

### format

• `Optional` **format**: [`SelectFormat`](../modules.md#selectformat)

The format of the selection. Default is multiline when type is string.

#### Defined in

[package/public/Select.ts:38](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L38)

___

### hits

• `Optional` **hits**: ``null`` \| `number`

**`Deprecated`**

Use `all` instead. Limits the number of query stage hits. Default is unlimited or specify null for unlimited.

#### Defined in

[package/public/Select.ts:30](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L30)

___

### limit

• `Optional` **limit**: ``null`` \| `number`

Limits the number of nodes returned by the query. Default is 1 when repeated is false and all is false, otherwise unlimited. Specify null to force unlimited nodes.

#### Defined in

[package/public/Select.ts:34](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L34)

___

### negate

• `Optional` **negate**: `boolean`

Negates a boolean result.

#### Defined in

[package/public/Select.ts:62](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L62)

___

### pattern

• `Optional` **pattern**: `string`

A validation pattern. Only applies if type is string.

#### Defined in

[package/public/Select.ts:42](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L42)

___

### pivot

• `Optional` **pivot**: [`SelectTarget`](SelectTarget.md)

A pivot target for the selection.

#### Defined in

[package/public/Select.ts:14](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L14)

___

### query

• `Optional` **query**: [`SelectQuery`](../modules.md#selectquery)[]

An array of queries to be executed.

#### Defined in

[package/public/Select.ts:10](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L10)

___

### removeNulls

• `Optional` **removeNulls**: `boolean`

Removes null values from arrays.

#### Defined in

[package/public/Select.ts:66](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L66)

___

### select

• `Optional` **select**: [`Select`](Select.md)[]

An array of sub-selections to be executed.

#### Defined in

[package/public/Select.ts:18](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L18)

___

### value

• `Optional` **value**: `unknown`

A value to be used in the selection. Executes after query if both are used.

#### Defined in

[package/public/Select.ts:22](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L22)

___

### waitfor

• `Optional` **waitfor**: `boolean`

Waits for the selector to appear when loading the page.

#### Defined in

[package/public/Select.ts:70](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L70)

___

### when

• `Optional` **when**: `string`

A condition that must be met for the selection to occur. SKIPPED actions indicate an unmet condition, BYPASSED actions indicate unexecuted actions in offline mode.

#### Defined in

[package/public/Select.ts:74](https://github.com/dtempx/syphonx-core/blob/6c56ba7/package/public/Select.ts#L74)
