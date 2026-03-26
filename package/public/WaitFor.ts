import { Select, SelectQuery, SelectOn } from "./Select.js";
import { When } from "./When.js";

/**
 * Polls the DOM until a condition is met or a timeout expires.
 * Used as a standalone `waitfor` action or as a post-click wait inside {@link Click}.
 * Ignored during offline extraction — only runs in online (browser) mode.
 *
 * Specify either `query` or `select` to define the condition:
 * - `query` — waits for a CSS/jQuery/XPath selector to match (and optionally match a text `pattern`).
 * - `select` — waits for one or more internal boolean selects to become truthy.
 *
 * If `when` is also specified, it is evaluated first; the query/select check
 * only runs when `when` is truthy.
 *
 * @example
 * // Standalone waitfor action: wait up to 5s for an `h1` to appear.
 * // Appends a `waitfor-timeout` error and halts if it never appears.
 * {
 *   "waitfor": {
 *     "query": [["h1"]],
 *     "required": true,
 *     "timeout": 5
 *   }
 * }
 *
 * @example
 * // Post-click waitfor: after clicking a link, wait for `h1` to appear
 * // before continuing to the next action.
 * {
 *   "click": {
 *     "query": [["a"]],
 *     "waitfor": { "query": [["h1"]] }
 *   }
 * }
 *
 * @example
 * // Select-based waitfor: after scrolling to the bottom of an infinite-scroll
 * // page, wait (up to 2s) for the image count to grow before continuing.
 * // A timeout here is silently ignored (required is false/omitted), allowing
 * // the loop to break naturally via the `break` action.
 * {
 *   "waitfor": {
 *     "select": [
 *       {
 *         "name": "_more",
 *         "type": "boolean",
 *         "query": [["img.image-grid__image", ["size"], ["filter", "{ value > _size }"]]]
 *       }
 *     ],
 *     "timeout": 2
 *   }
 * }
 *
 * @example
 * // Per-select waitfor flag: each select polls the DOM until its element
 * // appears, using the template-level timeout. A `waitfor-timeout` error
 * // (code `"waitfor-timeout"`, key matching the select name) is recorded for
 * // any element that never appears within the timeout.
 * {
 *   "select": [
 *     { "name": "a1", "waitfor": true, "query": [["#a1"]] },
 *     { "name": "a2", "waitfor": true, "query": [["#a2"]] }
 *   ]
 * }
 */
export interface WaitFor {
    /** Optional label used in log output (e.g. `WAITFOR myCondition`). */
    name?: string;

    /**
     * One or more selector queries to poll until a match is found.
     * Combined with `on` to control whether any or all stages must match.
     * Optionally filtered by `pattern` for text content matching.
     */
    query?: SelectQuery[];

    /**
     * One or more internal boolean selects to poll until truthy.
     * Each select must be internal (name starting with `_`), boolean, and non-repeated.
     * Combined with `on` to control whether any or all must be satisfied.
     */
    select?: Select[];

    /**
     * Controls how multiple query stages or selects are aggregated.
     * `"any"` (default) — passes as soon as at least one stage/select matches.
     * `"all"` — requires every stage/select to match before continuing.
     */
    on?: SelectOn;

    /**
     * Maximum time in seconds to poll before giving up.
     * Defaults to the template-level timeout when not specified.
     * If `required` is `true` and the timeout expires, a `waitfor-timeout` error is appended.
     */
    timeout?: number;

    /**
     * A regular expression pattern the matched text must satisfy.
     * Only applies when `query` is specified. Polling continues until both
     * the selector matches and the extracted text satisfies the pattern.
     */
    pattern?: string;

    /**
     * When `true`, a `waitfor-timeout` error is appended and processing halts
     * if the timeout expires without the condition being met.
     * When `false` (default), a timeout is silently ignored.
     */
    required?: boolean;

    /**
     * Expression that controls whether this wait executes.
     * When specified, `when` is evaluated first; the `query` or `select`
     * condition is only polled if `when` is truthy. When `when` is falsy
     * the action is skipped entirely.
     */
    when?: When;
}
