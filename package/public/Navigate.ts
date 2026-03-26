import { DocumentLoadState } from "./DocumentLoadState.js";
import { When } from "./When.js";

/**
 * Navigates the browser to a URL by yielding control to the Playwright host,
 * which calls `page.goto(url, { waitUntil })`. Only executes in online
 * (browser) mode — ignored during offline extraction.
 *
 * @example
 * // Navigate to a fixed URL and wait for the network to go idle
 * { navigate: { url: "https://example.com/products", waitUntil: "networkidle" } }
 *
 * @example
 * // Navigate to a URL built from an extracted value (expression interpolation)
 * { navigate: { url: "https://example.com/item/{$.id}" } }
 *
 * @example
 * // Named navigation — appears in log output as "NAVIGATE  detail https://example.com/detail"
 * { navigate: { name: "detail", url: "https://example.com/detail" } }
 *
 * @example
 * // Conditionally navigate only when a "next page" value was extracted
 * { navigate: { url: "{$.nextPage}", when: "$.nextPage" } }
 */
export interface Navigate {
    /** Optional label used in log output (e.g. `NAVIGATE  detail https://example.com/detail`). */
    name?: string;

    /**
     * The URL to navigate to. Supports expression evaluation — template
     * variables and extracted values can be interpolated at runtime
     * (e.g. `"https://example.com/item/{$.id}"`).
     */
    url: string;

    /**
     * The page-load state the Playwright host waits for before returning
     * control to the engine. Maps directly to Playwright's `waitUntil` option:
     * `"load"` (default), `"domcontentloaded"`, `"networkidle"`, or `"commit"`.
     */
    waitUntil?: DocumentLoadState;

    /**
     * Expression that controls whether this action executes.
     * When the expression evaluates to a falsy value the navigation is skipped.
     */
    when?: When;
}
