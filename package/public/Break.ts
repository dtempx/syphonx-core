import { SelectQuery, SelectOn } from "./Select.js";
import { When } from "./When.js";

/**
 * Conditionally breaks out of the enclosing `repeat` or `each` loop iteration.
 *
 * The break action is **online-only** — it is bypassed (no-op) when running in
 * offline mode. This is by design: break is typically used to detect pagination
 * boundaries or dynamic loading signals that only exist in a live browser.
 *
 * **Evaluation order:**
 * 1. If `when` is specified, it is evaluated first. If it is falsy the break is
 *    skipped entirely (logged as `SKIPPED`).
 * 2. If `when` is truthy (or omitted) and `query` is also specified, the query
 *    is evaluated next. The break fires only if the query check passes according
 *    to the `on` condition.
 * 3. If `when` is truthy (or omitted) and no `query` is given, the break fires
 *    unconditionally.
 *
 * When a break fires, the current loop iteration is stopped immediately and
 * control resumes after the enclosing `repeat` or `each` block.
 *
 * @example
 * // repeat/1: break when the "#next" pagination button disappears (on: "none"
 * // means "no nodes matched"), stopping the repeat loop early instead of
 * // running all `limit` iterations.
 * {
 *   "break": {
 *     "query": [["#next"]],
 *     "on": "none"
 *   }
 * }
 *
 * @example
 * // online/3: break when a formula-based condition is truthy — here `_more` is
 * // a boolean variable set by a prior waitfor step; when no more images loaded
 * // (`!_more`), the infinite-scroll repeat loop exits.
 * {
 *   "break": {
 *     "when": "{!_more}"
 *   }
 * }
 *
 * @example
 * // Combined when + query: the when guard is checked first; if truthy, the
 * // query is evaluated and the break fires only if the selector matches nothing.
 * {
 *   "break": {
 *     "when": "{_page > 1}",
 *     "query": [["#next"]],
 *     "on": "none"
 *   }
 * }
 */
export interface Break {
    /**
     * Optional label used in log output to identify this break action.
     * Appears as `BREAK <name>` in the execution log, making it easier to
     * trace which break fired when multiple breaks exist in the same loop.
     */
    name?: string;

    /**
     * One or more selector query stages evaluated as a boolean presence check.
     * The result is compared against the `on` condition to decide whether to
     * break. Only evaluated after `when` passes (or when `when` is omitted).
     *
     * Uses the same query format as {@link SelectTarget.query}:
     * `[["css-selector", ["method", "arg1"], ...]]`
     *
     * @example
     * // Break when the "#next" button is absent
     * query: [["#next"]]  // combined with on: "none"
     */
    query?: SelectQuery[];

    /**
     * Aggregation condition that determines whether the `query` result counts
     * as a match. Only meaningful when `query` is also specified.
     *
     * - `"any"` _(default)_ — breaks if **any** query stage matches
     * - `"all"` — breaks only if **all** query stages match
     * - `"none"` — breaks if **no** query stage matches (i.e. element absent)
     *
     * @example
     * // Break when there is no "#next" button (end of pagination)
     * { query: [["#next"]], on: "none" }
     */
    on?: SelectOn;

    /**
     * A text pattern (substring or regex string) the matched element's text
     * must satisfy for the query check to pass. Only meaningful when `query`
     * is also specified. When omitted, only node presence/absence is checked.
     */
    pattern?: string;

    /**
     * A formula expression that is evaluated before `query`. When falsy the
     * break is skipped. When omitted, evaluation proceeds directly to `query`
     * (or breaks unconditionally if `query` is also omitted).
     *
     * See {@link When} for expression syntax and variable scoping rules.
     *
     * @example
     * // Break when the template variable `_more` is false
     * when: "{!_more}"
     */
    when?: When;
}
