import { DocumentLoadState } from "./DocumentLoadState.js";
import { When } from "./When.js";

/**
 * Reloads the current page by yielding control to the Playwright host,
 * which calls `page.reload({ waitUntil })`. Only executes in online
 * (browser) mode — ignored during offline extraction.
 *
 * Internally, this action yields with a `reload` param, and the host
 * performs the page reload, waits for the specified load state, and then
 * re-enters the engine. The reload time is tracked under `__metrics.navigate`.
 * If the reload fails, a `host-error` with a `"RELOAD ..."` message is
 * recorded at error level 1.
 *
 * @example
 * // Reload the current page with default wait behavior
 * { "reload": {} }
 *
 * @example
 * // Reload and wait until the network is idle before continuing
 * { "reload": { "waitUntil": "networkidle" } }
 *
 * @example
 * // Named reload — appears in log output as "RELOAD  refresh"
 * { "reload": { "name": "refresh" } }
 *
 * @example
 * // Conditionally reload only when a flag is set
 * { "reload": { "when": "{_shouldReload}" } }
 */
export interface Reload {
    /** Optional label used in log output (e.g. `RELOAD  refresh`). */
    name?: string;

    /**
     * The page-load state the Playwright host waits for before returning
     * control to the engine. Maps directly to Playwright's `waitUntil` option:
     * `"load"` (default), `"domcontentloaded"`, or `"networkidle"`.
     */
    waitUntil?: DocumentLoadState;

    /**
     * Expression that controls whether this action executes.
     * When the expression evaluates to a falsy value the reload is skipped.
     */
    when?: When;
}
