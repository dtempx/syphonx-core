[syphonx-core](../README.md) / Scroll

# Interface: Scroll

Scrolls the page or a specific element into view.

Only executes in online (browser) mode — silently ignored during offline extraction.
After triggering the scroll, waits for the animation to finish before continuing
to the next action.

Use `target` to jump to the top or bottom of the page, or `query` to scroll a
specific element into view. If neither is provided, the action logs a warning and
is a no-op.

**`Example`**

```ts
// Scroll to the bottom of the page (e.g. to trigger infinite-scroll loading)
{ "scroll": { "target": "bottom" } }
```

**`Example`**

```ts
// Scroll back to the top of the page
{ "scroll": { "target": "top" } }
```

**`Example`**

```ts
// Scroll a specific element into view using a CSS selector
{ "scroll": { "query": [["h2:contains('Be in the room with')"]] } }
```

**`Example`**

```ts
// Scroll to the bottom on each repeat iteration to load more content
{
  "repeat": {
    "actions": [
      { "select": [{ "name": "count", "query": [["img.item", ["size"]]] }] },
      { "scroll": { "target": "bottom" } },
      { "waitfor": { "query": [["img.item:nth-child(12)"]] } }
    ]
  }
}
```

**`Example`**

```ts
// Scroll an element into view with custom alignment, snapping instantly
{ "scroll": { "query": [["#section-3"]], "behavior": "instant", "block": "start" } }
```

## Table of contents

### Properties

- [behavior](Scroll.md#behavior)
- [block](Scroll.md#block)
- [inline](Scroll.md#inline)
- [name](Scroll.md#name)
- [query](Scroll.md#query)
- [target](Scroll.md#target)
- [when](Scroll.md#when)

## Properties

### behavior

• `Optional` **behavior**: `ScrollBehavior`

Controls whether scrolling animates smoothly or jumps instantly to the destination.
Maps to the `behavior` option of `window.scrollTo()` and `scrollIntoView()`.
Defaults to `"smooth"`.

#### Defined in

[package/public/Scroll.ts:69](https://github.com/dtempx/syphonx-core/blob/main/package/public/Scroll.ts#L69)

___

### block

• `Optional` **block**: `ScrollLogicalPosition`

Vertical alignment of the element within the viewport when scrolling to a `query` target.
Maps to the `block` option of `scrollIntoView()`.
Defaults to `"center"`.

#### Defined in

[package/public/Scroll.ts:76](https://github.com/dtempx/syphonx-core/blob/main/package/public/Scroll.ts#L76)

___

### inline

• `Optional` **inline**: `ScrollLogicalPosition`

Horizontal alignment of the element within the viewport when scrolling to a `query` target.
Maps to the `inline` option of `scrollIntoView()`.
Defaults to `"nearest"`.

#### Defined in

[package/public/Scroll.ts:83](https://github.com/dtempx/syphonx-core/blob/main/package/public/Scroll.ts#L83)

___

### name

• `Optional` **name**: `string`

Optional label used in log output (e.g. `SCROLL mySection`).

#### Defined in

[package/public/Scroll.ts:45](https://github.com/dtempx/syphonx-core/blob/main/package/public/Scroll.ts#L45)

___

### query

• `Optional` **query**: [`SelectQuery`](../README.md#selectquery)[]

One or more selector queries to locate the element to scroll into view.
The first matched element is scrolled into view via `scrollIntoView()`,
using `behavior`, `block`, and `inline` to control alignment.
Takes effect only when `target` is not set.

#### Defined in

[package/public/Scroll.ts:53](https://github.com/dtempx/syphonx-core/blob/main/package/public/Scroll.ts#L53)

___

### target

• `Optional` **target**: [`ScrollTarget`](../README.md#scrolltarget)

Scrolls to the top or bottom of the page using `window.scrollTo()`.
- `"top"` scrolls to `y = 0`.
- `"bottom"` scrolls to `y = document.body.scrollHeight`.

When omitted and `query` is provided, scrolls the matched element into view instead.

#### Defined in

[package/public/Scroll.ts:62](https://github.com/dtempx/syphonx-core/blob/main/package/public/Scroll.ts#L62)

___

### when

• `Optional` **when**: `string`

Expression that controls whether this action executes. Skips the scroll when falsy.

#### Defined in

[package/public/Scroll.ts:86](https://github.com/dtempx/syphonx-core/blob/main/package/public/Scroll.ts#L86)
