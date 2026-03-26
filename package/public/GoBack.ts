import { When } from "./When.js";

/**
 * Navigates the browser back in history by yielding control to the Playwright
 * host, which calls `page.goBack()`. Equivalent to pressing the browser's Back
 * button. Only executes in online (browser) mode — ignored during offline
 * extraction.
 *
 * Internally, this action yields with a `goback` param, and the host performs
 * the back navigation, waits for the page to settle, and then re-enters the
 * engine. The navigation time is tracked under `__metrics.navigate`.
 *
 * @example
 * // Go back to the previous page after extracting data from a detail page
 * { "goback": {} }
 *
 * @example
 * // Named goback — appears in log output as "GOBACK  details"
 * { "goback": { "name": "details" } }
 *
 * @example
 * // Conditionally go back only when a flag is set
 * { "goback": { "when": "{_shouldGoBack}" } }
 *
 * @example
 * // Click into a detail page, extract data, then go back (common pagination pattern)
 * { "click": { "query": [["a.detail-link"]] } }
 * { "select": [{ "name": "detail", "query": [["#content"]] }] }
 * { "goback": {} }
 */
export interface GoBack {
    /** Optional label used in log output (e.g. `GOBACK  details`). */
    name?: string;

    /**
     * Expression that controls whether this action executes.
     * When the expression evaluates to a falsy value the goback is skipped.
     */
    when?: When;
}
