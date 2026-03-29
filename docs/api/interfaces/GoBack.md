[syphonx-core](../README.md) / GoBack

# Interface: GoBack

Navigates the browser back in history by yielding control to the Playwright
host, which calls `page.goBack()`. Equivalent to pressing the browser's Back
button. Only executes in online (browser) mode — ignored during offline
extraction.

Internally, this action yields with a `goback` param, and the host performs
the back navigation, waits for the page to settle, and then re-enters the
engine. The navigation time is tracked under `__metrics.navigate`.

**`Example`**

```ts
// Go back to the previous page after extracting data from a detail page
{ "goback": {} }
```

**`Example`**

```ts
// Named goback — appears in log output as "GOBACK  details"
{ "goback": { "name": "details" } }
```

**`Example`**

```ts
// Conditionally go back only when a flag is set
{ "goback": { "when": "{_shouldGoBack}" } }
```

**`Example`**

```ts
// Click into a detail page, extract data, then go back (common pagination pattern)
{ "click": { "query": [["a.detail-link"]] } }
{ "select": [{ "name": "detail", "query": [["#content"]] }] }
{ "goback": {} }
```

## Table of contents

### Properties

- [name](GoBack.md#name)
- [when](GoBack.md#when)

## Properties

### name

• `Optional` **name**: `string`

Optional label used in log output (e.g. `GOBACK  details`).

#### Defined in

[package/public/GoBack.ts:33](https://github.com/dtempx/syphonx-core/blob/main/package/public/GoBack.ts#L33)

___

### when

• `Optional` **when**: `string`

Expression that controls whether this action executes.
When the expression evaluates to a falsy value the goback is skipped.

#### Defined in

[package/public/GoBack.ts:39](https://github.com/dtempx/syphonx-core/blob/main/package/public/GoBack.ts#L39)
