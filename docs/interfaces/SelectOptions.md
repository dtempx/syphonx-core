[syphonx-core](../README.md) / [Exports](../modules.md) / SelectOptions

# Interface: SelectOptions

Options for configuring a [select](../modules.md#_select) invocation.

## Table of contents

### Properties

- [context](SelectOptions.md#context)
- [debug](SelectOptions.md#debug)
- [root](SelectOptions.md#root)
- [unwrap](SelectOptions.md#unwrap)
- [url](SelectOptions.md#url)
- [vars](SelectOptions.md#vars)

## Properties

### context

• `Optional` **context**: `string`

A CSS/jQuery selector that sets the root context node for all queries.

#### Defined in

[package/select.ts:16](https://github.com/dtempx/syphonx-core/blob/main/package/select.ts#L16)

___

### debug

• `Optional` **debug**: `boolean`

Enables debug logging when `true`.

#### Defined in

[package/select.ts:14](https://github.com/dtempx/syphonx-core/blob/main/package/select.ts#L14)

___

### root

• `Optional` **root**: `unknown`

A pre-existing data object to use as the root of the extraction result.

#### Defined in

[package/select.ts:18](https://github.com/dtempx/syphonx-core/blob/main/package/select.ts#L18)

___

### unwrap

• `Optional` **unwrap**: `boolean`

When `true`, unwraps singleton arrays in the output data.

#### Defined in

[package/select.ts:20](https://github.com/dtempx/syphonx-core/blob/main/package/select.ts#L20)

___

### url

• `Optional` **url**: `string`

The URL associated with the document, used for resolving relative references.

#### Defined in

[package/select.ts:10](https://github.com/dtempx/syphonx-core/blob/main/package/select.ts#L10)

___

### vars

• `Optional` **vars**: `Record`\<`string`, `unknown`\>

Variables to inject into the extraction state, accessible within selector expressions.

#### Defined in

[package/select.ts:12](https://github.com/dtempx/syphonx-core/blob/main/package/select.ts#L12)
