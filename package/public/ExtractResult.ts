import { ExtractState } from "./ExtractState.js";
import { Metrics } from "./Metrics.js"

/**
 * The final output of an extraction run.
 *
 * Extends {@link ExtractState} (minus the transient `yield` and `root` fields) with
 * computed summary fields added by the host after the engine finishes. In online mode
 * this is built in `host()` after the yield/re-enter loop completes; in offline mode
 * it is assembled by the test helper after `extract()` returns.
 */
export interface ExtractResult extends Omit<ExtractState, "yield" | "root"> {
    /**
     * Whether the extraction completed without errors.
     * `true` when `errors` is empty, `false` otherwise.
     */
    ok: boolean;

    /**
     * A serialized snapshot of the page HTML after extraction completes.
     * Only populated when the host is configured to capture HTML (e.g. `extractHtml`
     * option in online mode, or `cheerio.html()` in offline mode).
     */
    html?: string;

    /**
     * The HTTP status code from the last page navigation (e.g. 200, 404).
     * Set from the navigation result in online mode. In offline mode this is `0`.
     */
    status?: number;

    /** Version identifier for the extraction engine, stamped at build time. */
    version: string;

    /** Performance and diagnostic metrics collected during the extraction run. */
    metrics: Metrics;
}
