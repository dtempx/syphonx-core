[syphonx-core](../README.md) / KeyPress

# Interface: KeyPress

Dispatches a synthetic `keydown` keyboard event on the document.
Only executes in online (browser) mode — silently bypassed during
offline extraction.

The engine constructs a `KeyboardEvent("keydown", …)` with the
specified `key` and optional modifier flags, then calls
`document.dispatchEvent()`. This triggers any `keydown` listeners
attached to the document, which is useful for interacting with pages
that respond to keyboard shortcuts or key-driven UI updates.

**`Example`**

```ts
// Press the "A" key and then extract the value written by the page's keydown listener
{
  "actions": [
    { "keypress": { "key": "A" } },
    { "select": [{ "name": "keypress", "query": [["#keypress"]] }] }
  ]
}
```

**`Example`**

```ts
// Press Escape with a descriptive name (appears in log output as "KEYPRESS close-modal")
{ "keypress": { "name": "close-modal", "key": "Escape" } }
```

**`Example`**

```ts
// Press Ctrl+A to select all, conditional on a when expression
{ "keypress": { "key": "a", "control": true, "when": "$.ready" } }
```

## Table of contents

### Properties

- [alt](KeyPress.md#alt)
- [control](KeyPress.md#control)
- [key](KeyPress.md#key)
- [name](KeyPress.md#name)
- [shift](KeyPress.md#shift)
- [when](KeyPress.md#when)

## Properties

### alt

• `Optional` **alt**: `boolean`

When `true`, sets `altKey` on the dispatched `KeyboardEvent`.

#### Defined in

[package/public/KeyPress.ts:50](https://github.com/dtempx/syphonx-core/blob/main/package/public/KeyPress.ts#L50)

___

### control

• `Optional` **control**: `boolean`

When `true`, sets `ctrlKey` on the dispatched `KeyboardEvent`.

#### Defined in

[package/public/KeyPress.ts:47](https://github.com/dtempx/syphonx-core/blob/main/package/public/KeyPress.ts#L47)

___

### key

• **key**: `string`

The key value to send in the keyboard event. Corresponds to the
`KeyboardEvent.key` property (e.g. `"A"`, `"Enter"`, `"Escape"`).
Also used to derive `code`, `keyCode`, and `which` via
`"Key" + key.toUpperCase()` and `key.charCodeAt(0)`.

#### Defined in

[package/public/KeyPress.ts:41](https://github.com/dtempx/syphonx-core/blob/main/package/public/KeyPress.ts#L41)

___

### name

• `Optional` **name**: `string`

Optional label used in log output (e.g. `KEYPRESS close-modal`).

#### Defined in

[package/public/KeyPress.ts:33](https://github.com/dtempx/syphonx-core/blob/main/package/public/KeyPress.ts#L33)

___

### shift

• `Optional` **shift**: `boolean`

When `true`, sets `shiftKey` on the dispatched `KeyboardEvent`.

#### Defined in

[package/public/KeyPress.ts:44](https://github.com/dtempx/syphonx-core/blob/main/package/public/KeyPress.ts#L44)

___

### when

• `Optional` **when**: `string`

Expression that controls whether this action executes. Skips the keypress when falsy.

#### Defined in

[package/public/KeyPress.ts:53](https://github.com/dtempx/syphonx-core/blob/main/package/public/KeyPress.ts#L53)
