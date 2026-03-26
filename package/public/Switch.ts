import { Action } from "./Action.js";
import { SelectQuery } from "./Select.js";
import { When } from "./When.js";

/**
 * A single case within a `switch` action. A `switch` action contains an
 * ordered array of `Switch` cases. The engine evaluates each case in sequence
 * and runs the `actions` of the **first** case that matches — all subsequent
 * cases are skipped (like a `switch` statement with an implicit `break` after
 * every case).
 *
 * A case matches when both conditions are satisfied:
 * 1. Its {@link when} expression (if present) evaluates to a truthy value.
 * 2. Its {@link query} (if present) matches at least one DOM element (evaluated
 *    as a boolean). If `query` is omitted the case is treated as a **default /
 *    fallback** — it matches unconditionally (assuming `when` passes).
 *
 * If no case matches, the switch action does nothing and logs
 * `"SWITCH: NONE SELECTED"`.
 *
 * @example
 * // switch/1: single case — select content only when an <h1> contains "News"
 * {
 *   "switch": [
 *     {
 *       "query": [["h1:contains('News')"]],
 *       "actions": [
 *         {
 *           "select": [
 *             { "name": "content", "query": [["h1 ~ p"]] }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 * // Given <h1>News</h1><p>Lorum ipsum</p>
 * // Result: { content: "Lorum ipsum" }
 *
 * @example
 * // switch/2: multiple cases — match different page layouts by heading text
 * {
 *   "switch": [
 *     {
 *       "query": [["h1:contains('News')"]],
 *       "actions": [
 *         { "select": [{ "name": "content", "query": [["h1 ~ p"]] }] }
 *       ]
 *     },
 *     {
 *       "query": [["h1:contains('Weather')"]],
 *       "actions": [
 *         { "select": [{ "name": "content", "query": [["h1 ~ b"]] }] }
 *       ]
 *     }
 *   ]
 * }
 * // Given <h1>Weather</h1><b>Neque porro</b>
 * // Result: { content: "Neque porro" }
 *
 * @example
 * // switch/3: default fallback — a case with no query acts as a catch-all
 * {
 *   "switch": [
 *     {
 *       "query": [["h1:contains('News')"]],
 *       "actions": [
 *         { "select": [{ "name": "content", "query": [["h1 ~ p"]] }] }
 *       ]
 *     },
 *     {
 *       "query": [["h1:contains('Weather')"]],
 *       "actions": [
 *         { "select": [{ "name": "content", "query": [["h1 ~ b"]] }] }
 *       ]
 *     },
 *     {
 *       "actions": [
 *         { "select": [{ "name": "content", "query": [["h1 ~ i"]] }] }
 *       ]
 *     }
 *   ]
 * }
 * // Given <h1>Sports</h1><i>Ipsum quia dolor</i>
 * // Result: { content: "Ipsum quia dolor" }
 */
export interface Switch {
    /**
     * Optional label used in debug logs and metrics.
     * Appears in log entries as `SWITCH CASE n/N <name>`.
     */
    name?: string;

    /**
     * One or more selector stages evaluated as a **boolean** to determine
     * whether this case matches. Each stage is a `SelectQuery` (a CSS
     * selector, jQuery expression, or `{xpath}…` XPath expression, optionally
     * followed by chained method calls). The engine evaluates the stages in
     * order and treats the result as `true` if at least one node is matched.
     *
     * When omitted, the case is treated as a **default / fallback** and
     * matches unconditionally (provided the {@link when} condition also
     * passes). Place a query-less case last in the array to act as the
     * catch-all.
     */
    query?: SelectQuery[];

    /**
     * Actions to execute when this case is selected. Once a case matches,
     * its actions are run and all remaining cases are skipped — only the
     * first matching case in the array executes.
     */
    actions: Action[];

    /**
     * Optional condition that gates this case before the query is evaluated.
     * When present, the expression is evaluated first. If it is falsy the
     * case is skipped regardless of the query. See {@link When} for
     * expression syntax details.
     */
    when?: When;
}
