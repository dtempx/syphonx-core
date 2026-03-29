[syphonx-core](../README.md) / Navigate

# Interface: Navigate

Navigates the browser to a URL by yielding control to the Playwright host,
which calls `page.goto(url, { waitUntil })`. Only executes in online
(browser) mode — ignored during offline extraction.

**`Example`**

```ts
// Navigate to a fixed URL and wait for the network to go idle
{ navigate: { url: "https://example.com/products", waitUntil: "networkidle" } }
```

**`Example`**

```ts
// Navigate to a URL built from an extracted value (expression interpolation)
{ navigate: { url: "https://example.com/item/{$.id}" } }
```

**`Example`**

```ts
// Named navigation — appears in log output as "NAVIGATE  detail https://example.com/detail"
{ navigate: { name: "detail", url: "https://example.com/detail" } }
```

**`Example`**

```ts
// Conditionally navigate only when a "next page" value was extracted
{ navigate: { url: "{$.nextPage}", when: "$.nextPage" } }
```

## Table of contents

### Properties

- [name](Navigate.md#name)
- [url](Navigate.md#url)
- [waitUntil](Navigate.md#waituntil)
- [when](Navigate.md#when)

## Properties

### name

• `Optional` **name**: `string`

Optional label used in log output (e.g. `NAVIGATE  detail https://example.com/detail`).

#### Defined in

[package/public/Navigate.ts:27](https://github.com/dtempx/syphonx-core/blob/main/package/public/Navigate.ts#L27)

___

### url

• **url**: `string`

The URL to navigate to. Supports expression evaluation — template
variables and extracted values can be interpolated at runtime
(e.g. `"https://example.com/item/{$.id}"`).

#### Defined in

[package/public/Navigate.ts:34](https://github.com/dtempx/syphonx-core/blob/main/package/public/Navigate.ts#L34)

___

### waitUntil

• `Optional` **waitUntil**: [`DocumentLoadState`](../README.md#documentloadstate)

The page-load state the Playwright host waits for before returning
control to the engine. Maps directly to Playwright's `waitUntil` option:
`"load"` (default), `"domcontentloaded"`, `"networkidle"`, or `"commit"`.

#### Defined in

[package/public/Navigate.ts:41](https://github.com/dtempx/syphonx-core/blob/main/package/public/Navigate.ts#L41)

___

### when

• `Optional` **when**: `string`

Expression that controls whether this action executes.
When the expression evaluates to a falsy value the navigation is skipped.

#### Defined in

[package/public/Navigate.ts:47](https://github.com/dtempx/syphonx-core/blob/main/package/public/Navigate.ts#L47)
