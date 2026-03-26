import { When } from "./When.js";

/**
 * Controls the timing of a pause relative to an action. Used within
 * {@link SnoozeInterval} on actions like {@link Click} that support
 * before/after pausing.
 *
 * - `"before"` (default) — pause *before* the action executes.
 * - `"after"` — pause *after* the action (and any waitfor) completes.
 * - `"before-and-after"` — pause both before and after the action.
 */
export type SnoozeMode = "before" | "after" | "before-and-after";

/**
 * A compact tuple form for specifying a snooze pause on actions like
 * {@link Click}. Values are in seconds. The actual sleep duration is
 * randomized between `min` and `max` (capped by the template's max timeout).
 *
 * - `[min, max]` — sleep a random duration between `min` and `max` seconds,
 *   defaulting to `"before"` mode.
 * - `[min, max, mode]` — same, but explicitly sets when the pause occurs
 *   relative to the action (see {@link SnoozeMode}).
 *
 * @example
 * // Pause 1–2 seconds before clicking (default "before" mode)
 * { "click": { "query": [["a"]], "snooze": [1, 2] } }
 */
export type SnoozeInterval = [number, number] | [number, number, SnoozeMode];

/**
 * Pauses execution for a specified duration. Only takes effect in online
 * (browser) mode — in offline mode the snooze is logged but skipped entirely,
 * adding zero delay (see `offline/1` test).
 *
 * The sleep duration is derived from `interval`: when two values are given,
 * the engine sleeps for a random duration between them (capped by the
 * template's max timeout via `maxTimeout`). Elapsed snooze time is tracked
 * in `metrics.snooze`.
 *
 * Commonly used inside {@link Repeat} loops to throttle pagination — adding
 * a small delay between page transitions to avoid overwhelming the server
 * or triggering rate-limiting.
 *
 * The `snooze` action also accepts shorthand forms via {@link SnoozeAction}:
 * a bare number (`{ "snooze": 60 }`), a single-element tuple
 * (`{ "snooze": [60] }`), or a two-element tuple (`{ "snooze": [1, 2] }`).
 * These are equivalent to setting `interval` on the full `Snooze` object.
 *
 * `SnoozeInterval` is a separate compact tuple used on {@link Click} to add
 * a pause before/after a click — see {@link SnoozeInterval} and
 * {@link SnoozeMode} for that usage.
 *
 * @example
 * // Shorthand: pause for 60 seconds (single-element tuple)
 * { "snooze": [60] }
 *
 * @example
 * // Shorthand: pause for a bare number of seconds
 * { "snooze": 60 }
 *
 * @example
 * // Shorthand: pause for a random duration between 1 and 2 seconds
 * { "snooze": [1, 2] }
 *
 * @example
 * // offline/1: snooze is ignored in offline mode — no delay is added.
 * // The log will contain "SNOOZE 60s IGNORED".
 * {
 *   "actions": [
 *     { "snooze": [60] },
 *     { "select": [{ "name": "p1", "query": [["p"]] }] }
 *   ]
 * }
 *
 * @example
 * // repeat/1 (online): 0.25s snooze between pagination clicks to
 * // throttle requests while collecting titles across pages.
 * {
 *   "repeat": {
 *     "limit": 10,
 *     "actions": [
 *       { "select": [{ "name": "titles", "type": "string", "repeated": true, "query": [["h1"]] }] },
 *       { "snooze": [0.25] },
 *       { "break": { "query": [["#next"]], "on": "none" } },
 *       { "click": { "query": [["#next"]] } },
 *       { "yield": { "params": { "waitUntil": "domcontentloaded" } } }
 *     ]
 *   }
 * }
 */
export interface Snooze {
    /** Optional label used in log output (e.g. `SNOOZE myDelay`). */
    name?: string;

    /**
     * The sleep duration in seconds. When a single value is given (`[n]`),
     * the engine sleeps for exactly `n` seconds. When two values are given
     * (`[min, max]`), the engine sleeps for a random duration between `min`
     * and `max` (capped by the template's max timeout).
     */
    interval: [number] | [number, number];

    /**
     * Optional condition that gates this snooze. When present, the expression
     * is evaluated before sleeping. If it is falsy, the snooze is skipped and
     * the skipped-steps metric is incremented. See {@link When} for expression
     * syntax details.
     */
    when?: When;
}
