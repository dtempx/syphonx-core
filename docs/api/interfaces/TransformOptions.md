[syphonx-core](../README.md) / TransformOptions

# Interface: TransformOptions

Options for the standalone [transform](../README.md#_transform) function.

## Table of contents

### Properties

- [debug](TransformOptions.md#debug)
- [root](TransformOptions.md#root)
- [url](TransformOptions.md#url)
- [vars](TransformOptions.md#vars)

## Properties

### debug

• `Optional` **debug**: `boolean`

When `true`, enables verbose logging of each transform step to the console.

#### Defined in

[package/transform.ts:15](https://github.com/dtempx/syphonx-core/blob/main/package/transform.ts#L15)

___

### root

• `Optional` **root**: `unknown`

A pre-existing data root to seed the controller's `data` object, allowing transforms to reference previously extracted fields.

#### Defined in

[package/transform.ts:17](https://github.com/dtempx/syphonx-core/blob/main/package/transform.ts#L17)

___

### url

• `Optional` **url**: `string`

The URL of the page being transformed, made available to formula expressions as `_url`.

#### Defined in

[package/transform.ts:11](https://github.com/dtempx/syphonx-core/blob/main/package/transform.ts#L11)

___

### vars

• `Optional` **vars**: `Record`\<`string`, `unknown`\>

Template-level variables, accessible in formula expressions (e.g. `{_myVar}`).

#### Defined in

[package/transform.ts:13](https://github.com/dtempx/syphonx-core/blob/main/package/transform.ts#L13)
