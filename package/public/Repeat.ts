import { Action } from "./Action.js";
import { When } from "./When.js";

/**
 * Loops over a sequence of `actions` up to `limit` times, without tying
 * iterations to specific DOM elements. Each iteration runs the full `actions`
 * array, and the loop exits when:
 *
 * - The `limit` count is reached, or
 * - A `break` action fires inside the loop, or
 * - The cumulative error count meets or exceeds `errors`.
 *
 * The engine tracks per-loop state (`RepeatState`) keyed by execution depth,
 * so nested repeats each maintain independent iteration counters. Within the
 * loop body, actions like `select` accumulate values across iterations when
 * their `repeated` flag is set (e.g. collecting titles from every page).
 *
 * **Difference from `each`:** `each` iterates over a *fixed set of DOM
 * elements* determined by a query — the number of iterations equals the number
 * of matched nodes and each iteration's context is scoped to a single element.
 * `repeat` loops the same actions up to a configurable `limit` without tying
 * iterations to specific DOM nodes; it is typically used for open-ended
 * pagination or polling scenarios where the stopping condition is determined
 * dynamically at runtime (e.g. a "next" button disappearing). Use `each` when
 * you know the element set up front; use `repeat` when the number of
 * iterations depends on runtime page state.
 *
 * @example
 * // repeat/1 (online): paginate through a series of pages, collecting
 * // all <h1> titles. A break action exits once the "#next" button
 * // disappears, and a yield hands control back to the host after each click.
 * {
 *   "repeat": {
 *     "limit": 10,
 *     "actions": [
 *       {
 *         "select": [
 *           { "name": "titles", "type": "string", "repeated": true, "query": [["h1"]] }
 *         ]
 *       },
 *       { "snooze": [0.25] },
 *       { "break": { "query": [["#next"]], "on": "none" } },
 *       { "click": { "query": [["#next"]] } },
 *       { "yield": { "params": { "waitUntil": "domcontentloaded" } } }
 *     ]
 *   }
 * }
 * // Result: { titles: ["First", "Second", "Third", "Fourth", "Fifth"] }
 *
 * @example
 * // repeat/2 (online): same pagination pattern but with limit=2 to cap the
 * // number of pages visited, regardless of remaining content.
 * {
 *   "repeat": {
 *     "limit": 2,
 *     "actions": [
 *       {
 *         "select": [
 *           { "name": "titles", "type": "string", "repeated": true, "query": [["h1"]] }
 *         ]
 *       },
 *       { "snooze": [0.25] },
 *       { "break": { "query": [["#next"]], "on": "none" } },
 *       { "click": { "query": [["#next"]] } },
 *       { "yield": { "params": { "waitUntil": "domcontentloaded" } } }
 *     ]
 *   }
 * }
 * // Result: { titles: ["First", "Second"] }
 */
export interface Repeat {
    /**
     * Optional label used in debug logs and metrics.
     * Appears in log entries as `REPEAT <name>`.
     */
    name?: string;

    /**
     * Actions to execute on each iteration. The full array runs sequentially
     * per iteration. A `break` action inside `actions` stops the loop early.
     * `select` actions with `repeated: true` accumulate values across
     * iterations, which is the standard pattern for collecting data from
     * paginated content.
     */
    actions: Action[];

    /**
     * Maximum number of iterations. Can be a literal number or a formula
     * string that is evaluated at runtime via `evaluateNumber`. If omitted
     * or if the formula evaluates to `undefined`, defaults to `1`.
     */
    limit?: number | string;

    /**
     * Maximum number of cumulative errors allowed before the loop aborts.
     * When the error count (relative to the error count at loop entry) meets
     * or exceeds this value, the engine appends an `"error-limit"` error and
     * breaks out of the loop. Defaults to `1`.
     */
    errors?: number;

    /**
     * Optional condition that gates the entire loop. When present, the
     * expression is evaluated before the first iteration. If it is falsy the
     * action is skipped entirely and the skipped-steps metric is incremented.
     * See {@link When} for expression syntax details.
     */
    when?: When;
}
