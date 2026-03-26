[syphonx-core](../README.md) / [Exports](../modules.md) / ExtractError

# Interface: ExtractError

Represents an error that occurred during extraction.

Extract errors are produced by the controller when an error action fires,
a required select is missing, an operator is invalid, or an unexpected
exception occurs. They are collected in [ExtractState.errors](ExtractState.md#errors) and
included in the final [ExtractResult](ExtractResult.md).

## Table of contents

### Properties

- [code](ExtractError.md#code)
- [key](ExtractError.md#key)
- [level](ExtractError.md#level)
- [message](ExtractError.md#message)
- [stack](ExtractError.md#stack)

## Properties

### code

• **code**: [`ExtractErrorCode`](../modules.md#extracterrorcode)

The error code identifying the category of error.

#### Defined in

[package/public/ExtractError.ts:13](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractError.ts#L13)

___

### key

• `Optional` **key**: `string`

The hierarchical context key identifying where in the extraction tree
the error occurred (e.g. `"title"`, `"items.name"`).
Built from the current select context stack at the time the error was recorded.

#### Defined in

[package/public/ExtractError.ts:31](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractError.ts#L31)

___

### level

• **level**: `number`

The severity level controlling retry behavior and whether processing stops.
- `0` — non-retryable (fatal), processing stops by default.
- `1` — retryable, processing continues by default.
- `2+` — retryable with higher severity, processing stops by default.

#### Defined in

[package/public/ExtractError.ts:24](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractError.ts#L24)

___

### message

• **message**: `string`

A human-readable description of what went wrong. May contain evaluated template expressions.

#### Defined in

[package/public/ExtractError.ts:16](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractError.ts#L16)

___

### stack

• `Optional` **stack**: `string`

The stack trace, present when the error originated from a caught exception.

#### Defined in

[package/public/ExtractError.ts:34](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractError.ts#L34)
