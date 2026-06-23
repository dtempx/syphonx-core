# Timeout Behavior

SyphonX has a layered timeout system. There is a **master timeout** that caps the total extraction run, a **master `waitUntil`** that chooses which page load state navigation waits for, and **per-action timeouts and `waitUntil` overrides** that refine behavior for individual operations.

> **Note:** Timeout and `waitUntil` behavior only apply in online (browser) mode. Offline extraction runs synchronously against a static DOM — `waitfor`, `snooze`, navigation, and yield operations are all bypassed, so timeouts are never enforced and `waitUntil` is ignored.

> **Fractional timeouts are supported.** All timeout values are expressed in seconds and handled as floating-point numbers, so sub-second values are valid. For example, `"timeout": 0.5` means 500 milliseconds. Note that `waitfor` polls the DOM every 100ms, so timeouts finer than ~0.1s effectively round up to the next poll tick.

## Master Timeout

The master timeout sets an upper bound on the entire extraction run. It is configured via the template-level `timeout` property (in seconds) and defaults to **30 seconds**.

```json
{
    "timeout": 60,
    "waitUntil": "domcontentloaded",
    "actions": [...]
}
```

Internally, the engine tracks the time elapsed since extraction started. Every blocking operation (`waitfor`, `snooze`, `click` with `waitfor`, etc.) is capped at the lesser of its own timeout and the remaining master timeout budget. This means the master timeout is a hard ceiling — no individual operation can extend the run beyond it.

### Disabling the master timeout

Set `"timeout": 0` to disable the master timeout entirely. The engine treats `0` as "no master timeout" (represented internally as `Infinity`), so per-action waits are no longer clamped to a remaining budget. The value `0` is also forwarded to Playwright, which interprets `timeout: 0` as "no navigation timeout" on `page.goto()`, `page.reload()`, and `page.goBack()`.

```json
{
    "timeout": 0,
    "actions": [...]
}
```

Omitting `timeout` keeps the default of 30 seconds — only an explicit `0` disables it.

The companion setting to `timeout` is [`waitUntil`](#master-waituntil), which controls *which* page lifecycle event each navigation waits for within that time budget.

## Master `waitUntil`

The master `waitUntil` is configured via the template-level `waitUntil` property and controls the page lifecycle event that navigation operations wait for. This setting delegates directly to [Playwright's `waitUntil` option](https://playwright.dev/docs/api/class-page#page-goto-option-wait-until) and is forwarded to `page.goto()`, `page.reload()`, `page.goBack()`, and `page.waitForLoadState()` via the host callbacks (`onNavigate`, `onReload`, `onGoback`, `onYield`).

| Value | Meaning |
|---|---|
| `"load"` *(default)* | Wait for the `load` event — fires when the document and all of its sub-resources (stylesheets, images, etc.) have finished loading. This is the default setting if `waitUntil` is not specified. |
| `"domcontentloaded"` | Wait for the `DOMContentLoaded` event — fires as soon as the HTML is parsed and deferred scripts have executed, without waiting for images or stylesheets. Typically the fastest signal the DOM is usable. |
| `"networkidle"` | Wait until there have been no network connections for at least 500ms. Useful for single-page apps that populate content via XHR/fetch after the initial load, but can hang on sites that keep long-lived connections open (analytics, sockets). |
| `"commit"` | Return as soon as the network response is received and the document begins loading, before parsing or resource fetching. Effectively disables waiting for the page to settle — use this when you want the fastest possible handoff and plan to gate later actions with an explicit `waitfor`. |

When `waitUntil` is omitted from the template, Playwright's own default is used (`"load"`).

```json
{
    "timeout": 60,
    "waitUntil": "domcontentloaded",
    "actions": [...]
}
```

The master `waitUntil` is applied to:

- The initial navigation that opens `template.url`
- `navigate`, `reload`, and `goback` actions
- `yield` operations triggered by `click` with `yield: true`

Per-action `waitUntil` values (on `click`, `navigate`, `reload`, or `yield.params.waitUntil`) override the master setting for that operation only.

### Disabling `waitUntil`

There is no "no wait" value, but `"commit"` is the closest equivalent — Playwright returns as soon as the initial network response arrives, skipping any further page-lifecycle wait. Combine it with an explicit `waitfor` action when you need to gate later extraction on a specific DOM condition.

```json
{
    "waitUntil": "commit",
    "actions": [
        { "waitfor": { "query": [["#results"]], "timeout": 10 } }
    ]
}
```

## Per-Action Timeouts

### `waitfor` Action

The `waitfor` action accepts an optional `timeout` (in seconds). When omitted, it uses the master timeout as its limit.

```json
{
    "waitfor": {
        "query": [["#results"]],
        "timeout": 10,
        "required": true
    }
}
```

- When `required: true` and the timeout expires, a `waitfor-timeout` error is appended and execution halts.
- When `required` is omitted or `false`, a timeout is silently ignored and execution continues.

### `waitfor` on `select` Fields

Individual fields in a `select` action can specify `"waitfor": true` to poll the DOM until the element appears. These use the master timeout as their limit.

```json
{
    "select": [
        { "name": "title", "waitfor": true, "query": [["h1"]] }
    ]
}
```

If a field never appears, a `waitfor-timeout` error is recorded for that field's key.

### `click` with `waitfor`

A `click` action can include a `waitfor` condition that is checked after the click. If the condition does not become true within the timeout, a `click-timeout` error is appended.

```json
{
    "click": {
        "query": [["button.load-more"]],
        "waitfor": { "query": [["li.result"]], "timeout": 5 }
    }
}
```

### `click` without `waitfor`

When a `click` action has no `waitfor`, whether the engine waits after the click depends on which other options are set:

| Case | Post-click wait |
|---|---|
| `yield: true` is set on the click | The engine yields to the host with `{ click: {}, waitUntil }`. The host sleeps for **1 second** to let the page settle, then invokes `onYield`, which waits for the Playwright load state (`waitUntil` on the click, or falling back to the template-level `waitUntil`). |
| Neither `waitfor` nor `yield` is set | **No implicit wait.** The DOM `element.click()` fires synchronously and the controller moves immediately to the next action. |

`snooze` modifiers interact with this as follows:

- `snooze` in `"before"` or `"before-and-after"` mode always pauses *before* the click (capped at the remaining master timeout).
- `snooze` in `"after"` or `"before-and-after"` mode only runs when a `waitfor` was specified **and** its condition was satisfied. Without `waitfor`, an `"after"` snooze is silently skipped.

**Implication:** if a click triggers navigation or async DOM updates and you need the engine to wait before the next action, you must provide either a `waitfor` condition, set `yield: true` (with an appropriate `waitUntil`), or add an explicit `snooze`/`waitfor` action afterward. Otherwise, subsequent selects may run against the pre-click DOM state.

### `snooze` Action

`snooze` pauses for a fixed or random interval. The pause duration is also capped by the remaining master timeout budget — the engine will not sleep longer than the time remaining.

```json
{ "snooze": { "interval": [1, 3] } }
```

## Navigation Timeout

Navigation operations (`navigate`, `goback`, `reload`) pass the master timeout (converted to milliseconds) along with the master `waitUntil` to the Playwright host callbacks. Together these control how long Playwright waits and which page lifecycle event it waits for. The master timeout value is set when extraction starts and does not decrease as the run progresses — it represents the full configured budget, not the remaining budget.

```json
{
    "timeout": 60,
    "waitUntil": "domcontentloaded",
    "actions": [
        { "navigate": { "url": "https://example.com/page2" } }
    ]
}
```

Per-yield overrides are supported via `state.yield.params.timeout` and `state.yield.params.waitUntil`. See [Master `waitUntil`](#master-waituntil) for the set of allowed values.

## Summary

| Context | Timeout source | `waitUntil` source | Behavior on expiry |
|---|---|---|---|
| Overall extraction run | `template.timeout` (default 30s; `0` = disabled) | — | Hard cap — all waits are clamped to remaining budget (no cap when disabled) |
| `waitfor` action | `waitfor.timeout` → falls back to master timeout | — | `required: true` → error + halt; `required: false` → silently skip |
| `select` with `waitfor: true` | Master timeout | — | `waitfor-timeout` error per field |
| `click` with `waitfor` | `waitfor.timeout` → falls back to master timeout | — | `click-timeout` error |
| `click` with `yield: true` | Master timeout | `click.waitUntil` → master `waitUntil` | Playwright load-state timeout |
| `snooze` | Master timeout remaining | — | Sleep capped at remaining budget |
| Navigation (`navigate`, `goback`, `reload`) | Per-action/per-yield `timeout` → master `timeout` | Per-action/per-yield `waitUntil` → master `waitUntil` (defaults to Playwright's `"load"`) | Playwright navigation timeout |

## Error Codes

| Code | When raised |
|---|---|
| `waitfor-timeout` | `waitfor` action or per-select `waitfor: true` timed out |
| `click-timeout` | Post-click `waitfor` condition timed out |
