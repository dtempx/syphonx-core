[syphonx-core](../README.md) / [Exports](../modules.md) / ExtractResult

# Interface: ExtractResult

The final output of an extraction run.

Extends [ExtractState](ExtractState.md) (minus the transient `yield` and `root` fields) with
computed summary fields added by the host after the engine finishes. In online mode
this is built in `host()` after the yield/re-enter loop completes; in offline mode
it is assembled by the test helper after `extract()` returns.

## Hierarchy

- `Omit`\<[`ExtractState`](ExtractState.md), ``"yield"`` \| ``"root"``\>

  ↳ **`ExtractResult`**

## Table of contents

### Properties

- [html](ExtractResult.md#html)
- [metrics](ExtractResult.md#metrics)
- [ok](ExtractResult.md#ok)
- [status](ExtractResult.md#status)
- [version](ExtractResult.md#version)

## Properties

### html

• `Optional` **html**: `string`

A serialized snapshot of the page HTML after extraction completes.
Only populated when the host is configured to capture HTML (e.g. `extractHtml`
option in online mode, or `cheerio.html()` in offline mode).

#### Defined in

[package/public/ExtractResult.ts:24](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractResult.ts#L24)

___

### metrics

• **metrics**: [`Metrics`](Metrics.md)

Performance and diagnostic metrics collected during the extraction run.

#### Defined in

[package/public/ExtractResult.ts:36](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractResult.ts#L36)

___

### ok

• **ok**: `boolean`

Whether the extraction completed without errors.
`true` when `errors` is empty, `false` otherwise.

#### Defined in

[package/public/ExtractResult.ts:17](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractResult.ts#L17)

___

### status

• `Optional` **status**: `number`

The HTTP status code from the last page navigation (e.g. 200, 404).
Set from the navigation result in online mode. In offline mode this is `0`.

#### Defined in

[package/public/ExtractResult.ts:30](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractResult.ts#L30)

___

### version

• **version**: `string`

Version identifier for the extraction engine, stamped at build time.

#### Defined in

[package/public/ExtractResult.ts:33](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractResult.ts#L33)
