# Timeout Behavior

SyphonX has a layered timeout system. There is a **master timeout** that caps the total extraction run, and **per-action timeouts** that limit how long individual wait operations can block.

> **Note:** Timeout behavior only applies in online (browser) mode. Offline extraction runs synchronously against a static DOM — `waitfor`, `snooze`, and navigation operations are all bypassed, so timeouts are never enforced.

## Master Timeout

The master timeout sets an upper bound on the entire extraction run. It is configured via the template-level `timeout` property (in seconds) and defaults to **30 seconds**.

```json
{
    "timeout": 60,
    "actions": [...]
}
```

Internally, the engine tracks the time elapsed since extraction started. Every blocking operation (`waitfor`, `snooze`, `click` with `waitfor`, etc.) is capped at the lesser of its own timeout and the remaining master timeout budget. This means the master timeout is a hard ceiling — no individual operation can extend the run beyond it.

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

### `snooze` Action

`snooze` pauses for a fixed or random interval. The pause duration is also capped by the remaining master timeout budget — the engine will not sleep longer than the time remaining.

```json
{ "snooze": { "interval": [1, 3] } }
```

## Navigation Timeout

Navigation operations (`navigate`, `goback`, `reload`) pass the master timeout (converted to milliseconds) to the Playwright host callbacks. This controls how long Playwright waits for the page load state. The master timeout value is set when extraction starts and does not decrease as the run progresses — it represents the full configured budget, not the remaining budget.

```json
{
    "timeout": 60,
    "waitUntil": "domcontentloaded",
    "actions": [
        { "navigate": { "url": "https://example.com/page2" } }
    ]
}
```

Per-yield overrides are also supported via `state.yield.params.timeout` and `state.yield.params.waitUntil`.

## Summary

| Context | Timeout source | Behavior on expiry |
|---|---|---|
| Overall extraction run | `template.timeout` (default 30s) | Hard cap — all waits are clamped to remaining budget |
| `waitfor` action | `waitfor.timeout` → falls back to master timeout | `required: true` → error + halt; `required: false` → silently skip |
| `select` with `waitfor: true` | Master timeout | `waitfor-timeout` error per field |
| `click` with `waitfor` | `waitfor.timeout` → falls back to master timeout | `click-timeout` error |
| `snooze` | Master timeout remaining | Sleep capped at remaining budget |
| Navigation (`navigate`, `goback`, `reload`) | `template.timeout` in ms | Playwright navigation timeout |

## Error Codes

| Code | When raised |
|---|---|
| `waitfor-timeout` | `waitfor` action or per-select `waitfor: true` timed out |
| `click-timeout` | Post-click `waitfor` condition timed out |
