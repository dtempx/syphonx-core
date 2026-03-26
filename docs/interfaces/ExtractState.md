[syphonx-core](../README.md) / [Exports](../modules.md) / ExtractState

# Interface: ExtractState

Represents the complete state of an extraction run.

This is the primary state object passed into the extraction engine and carried across
yield/re-enter cycles during online (browser) execution. It holds the template actions,
accumulated data, error log, and all configuration needed for a single extraction pass.

Fields are initialized in the `Controller` constructor and progressively mutated as
actions execute. During online extraction, the state is serialized on yield, updated by
the host (e.g. Playwright), and deserialized on re-entry.

## Indexable

▪ [key: `string`]: `any`

## Table of contents

### Properties

- [actions](ExtractState.md#actions)
- [context](ExtractState.md#context)
- [data](ExtractState.md#data)
- [debug](ExtractState.md#debug)
- [domain](ExtractState.md#domain)
- [errors](ExtractState.md#errors)
- [log](ExtractState.md#log)
- [origin](ExtractState.md#origin)
- [originalUrl](ExtractState.md#originalurl)
- [params](ExtractState.md#params)
- [root](ExtractState.md#root)
- [timeout](ExtractState.md#timeout)
- [unpatch](ExtractState.md#unpatch)
- [url](ExtractState.md#url)
- [vars](ExtractState.md#vars)
- [version](ExtractState.md#version)
- [yield](ExtractState.md#yield)

## Properties

### actions

• **actions**: [`Action`](../modules.md#action)[]

The ordered list of extraction actions to execute (select, click, navigate, etc.).

#### Defined in

[package/public/ExtractState.ts:20](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L20)

___

### context

• `Optional` **context**: `string`

A CSS selector used to initialize the outer select context for synchronous extraction.
When provided, the matching nodes become the initial `__context` stack entry, scoping
all subsequent select operations. Intended for use with `extractSync()`.

#### Defined in

[package/public/ExtractState.ts:100](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L100)

___

### data

• **data**: `any`

The accumulated extraction output. Select actions progressively merge their results
into this object. Returned as the final extraction result.

#### Defined in

[package/public/ExtractState.ts:59](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L59)

___

### debug

• **debug**: `boolean`

Enables verbose logging and debug messaging. When `true`, log entries are written
to `log` and step-level status messages are sent via `postMessage` in online mode.

#### Defined in

[package/public/ExtractState.ts:75](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L75)

___

### domain

• **domain**: `string`

The registered domain parsed from `url` (e.g. `"example.com"`).
Derived automatically via `parseUrl()` in the constructor.

#### Defined in

[package/public/ExtractState.ts:32](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L32)

___

### errors

• **errors**: [`ExtractError`](ExtractError.md)[]

Accumulated extraction errors and validation failures.

#### Defined in

[package/public/ExtractState.ts:69](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L69)

___

### log

• **log**: `string`

Cumulative debug log output. Only written to when `debug` is `true`. Each entry is
timestamped with elapsed seconds. Repeated identical log lines are collapsed with
an updated timestamp rather than duplicated.

#### Defined in

[package/public/ExtractState.ts:66](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L66)

___

### origin

• **origin**: `string`

The protocol and host parsed from `url` (e.g. `"https://example.com:8080"`).
Used by `formatStringValue()` to resolve relative and protocol-relative URLs
in extracted data.

#### Defined in

[package/public/ExtractState.ts:39](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L39)

___

### originalUrl

• `Optional` **originalUrl**: `string`

The original target URL before any navigations or redirects during extraction.
Captured by the host at the start of extraction and returned in the final result
for debugging and provenance tracking.

#### Defined in

[package/public/ExtractState.ts:107](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L107)

___

### params

• **params**: `Record`\<`string`, `unknown`\>

Template parameters available to formula expressions during extraction.
Merged from the template definition and runtime options before extraction begins.

#### Defined in

[package/public/ExtractState.ts:45](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L45)

___

### root

• `Optional` **root**: `unknown`

Optional jQuery or Cheerio instance used as the DOM query engine. When running
offline (Node.js/Cheerio), this carries the loaded DOM. Defaults to the global `$`
when not provided (online/browser mode).

#### Defined in

[package/public/ExtractState.ts:90](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L90)

___

### timeout

• `Optional` **timeout**: `number`

Master timeout for the entire extraction run, in seconds. Defaults to 30.

#### Defined in

[package/public/ExtractState.ts:93](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L93)

___

### unpatch

• **unpatch**: `string`[]

List of browser API property paths to restore from an unpatched iframe context
(e.g. `["Navigator.prototype.sendBeacon"]`). Used to bypass website monkey-patching
of native APIs that may interfere with extraction.

#### Defined in

[package/public/ExtractState.ts:114](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L114)

___

### url

• **url**: `string`

The current page URL. In online mode this is overwritten with `window.location.href`
on each engine entry. Used to derive `domain` and `origin`.

#### Defined in

[package/public/ExtractState.ts:26](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L26)

___

### vars

• **vars**: `Record`\<`string`, `unknown`\>

Mutable variables carried across actions and yield cycles. User-defined variables
coexist with internal variables (prefixed with `__`) such as `__metrics`, `__context`,
`__repeat`, `__step`, `__t0`, `__timeout`, and `__yield`. Select results whose name
starts with `"_"` are stored here rather than in `data`.

#### Defined in

[package/public/ExtractState.ts:53](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L53)

___

### version

• **version**: `string`

Version identifier for the extraction engine.

#### Defined in

[package/public/ExtractState.ts:117](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L117)

___

### yield

• `Optional` **yield**: [`YieldState`](YieldState.md)

Serializable snapshot of the engine pause point for host-side async operations.
Set when the engine yields control (e.g. for navigation, screenshot, or click),
and cleared (`undefined`) on re-entry. Contains the action step path for resumption
and the parameters describing the host action to perform.

#### Defined in

[package/public/ExtractState.ts:83](https://github.com/dtempx/syphonx-core/blob/main/package/public/ExtractState.ts#L83)
