[syphonx-core](../README.md) / [Exports](../modules.md) / Reload

# Interface: Reload

Reloads the current page by yielding control to the Playwright host,
which calls `page.reload({ waitUntil })`. Only executes in online
(browser) mode — ignored during offline extraction.

Internally, this action yields with a `reload` param, and the host
performs the page reload, waits for the specified load state, and then
re-enters the engine. The reload time is tracked under `__metrics.navigate`.
If the reload fails, a `host-error` with a `"RELOAD ..."` message is
recorded at error level 1.

**`Example`**

```ts
// Reload the current page with default wait behavior
{ "reload": {} }
```

**`Example`**

```ts
// Reload and wait until the network is idle before continuing
{ "reload": { "waitUntil": "networkidle" } }
```

**`Example`**

```ts
// Named reload — appears in log output as "RELOAD  refresh"
{ "reload": { "name": "refresh" } }
```

**`Example`**

```ts
// Conditionally reload only when a flag is set
{ "reload": { "when": "{_shouldReload}" } }
```

## Table of contents

### Properties

- [name](Reload.md#name)
- [waitUntil](Reload.md#waituntil)
- [when](Reload.md#when)

## Properties

### name

• `Optional` **name**: `string`

Optional label used in log output (e.g. `RELOAD  refresh`).

#### Defined in

[package/public/Reload.ts:33](https://github.com/dtempx/syphonx-core/blob/main/package/public/Reload.ts#L33)

___

### waitUntil

• `Optional` **waitUntil**: [`DocumentLoadState`](../modules.md#documentloadstate)

The page-load state the Playwright host waits for before returning
control to the engine. Maps directly to Playwright's `waitUntil` option:
`"load"` (default), `"domcontentloaded"`, or `"networkidle"`.

#### Defined in

[package/public/Reload.ts:40](https://github.com/dtempx/syphonx-core/blob/main/package/public/Reload.ts#L40)

___

### when

• `Optional` **when**: `string`

Expression that controls whether this action executes.
When the expression evaluates to a falsy value the reload is skipped.

#### Defined in

[package/public/Reload.ts:46](https://github.com/dtempx/syphonx-core/blob/main/package/public/Reload.ts#L46)
