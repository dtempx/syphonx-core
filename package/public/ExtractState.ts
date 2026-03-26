import { ExtractError } from "./ExtractError";
import { Action } from "./Action.js";
import { YieldState } from "./Yield.js";

/**
 * Represents the complete state of an extraction run.
 *
 * This is the primary state object passed into the extraction engine and carried across
 * yield/re-enter cycles during online (browser) execution. It holds the template actions,
 * accumulated data, error log, and all configuration needed for a single extraction pass.
 *
 * Fields are initialized in the `Controller` constructor and progressively mutated as
 * actions execute. During online extraction, the state is serialized on yield, updated by
 * the host (e.g. Playwright), and deserialized on re-entry.
 */
export interface ExtractState {
    [key: string]: any;

    /** The ordered list of extraction actions to execute (select, click, navigate, etc.). */
    actions: Action[];

    /**
     * The current page URL. In online mode this is overwritten with `window.location.href`
     * on each engine entry. Used to derive `domain` and `origin`.
     */
    url: string;

    /**
     * The registered domain parsed from `url` (e.g. `"example.com"`).
     * Derived automatically via `parseUrl()` in the constructor.
     */
    domain: string;

    /**
     * The protocol and host parsed from `url` (e.g. `"https://example.com:8080"`).
     * Used by `formatStringValue()` to resolve relative and protocol-relative URLs
     * in extracted data.
     */
    origin: string;

    /**
     * Template parameters available to formula expressions during extraction.
     * Merged from the template definition and runtime options before extraction begins.
     */
    params: Record<string, unknown>;

    /**
     * Mutable variables carried across actions and yield cycles. User-defined variables
     * coexist with internal variables (prefixed with `__`) such as `__metrics`, `__context`,
     * `__repeat`, `__step`, `__t0`, `__timeout`, and `__yield`. Select results whose name
     * starts with `"_"` are stored here rather than in `data`.
     */
    vars: Record<string, unknown>;

    /**
     * The accumulated extraction output. Select actions progressively merge their results
     * into this object. Returned as the final extraction result.
     */
    data: any;

    /**
     * Cumulative debug log output. Only written to when `debug` is `true`. Each entry is
     * timestamped with elapsed seconds. Repeated identical log lines are collapsed with
     * an updated timestamp rather than duplicated.
     */
    log: string;

    /** Accumulated extraction errors and validation failures. */
    errors: ExtractError[];

    /**
     * Enables verbose logging and debug messaging. When `true`, log entries are written
     * to `log` and step-level status messages are sent via `postMessage` in online mode.
     */
    debug: boolean;

    /**
     * Serializable snapshot of the engine pause point for host-side async operations.
     * Set when the engine yields control (e.g. for navigation, screenshot, or click),
     * and cleared (`undefined`) on re-entry. Contains the action step path for resumption
     * and the parameters describing the host action to perform.
     */
    yield?: YieldState;

    /**
     * Optional jQuery or Cheerio instance used as the DOM query engine. When running
     * offline (Node.js/Cheerio), this carries the loaded DOM. Defaults to the global `$`
     * when not provided (online/browser mode).
     */
    root?: unknown;

    /** Master timeout for the entire extraction run, in seconds. Defaults to 30. */
    timeout?: number;

    /**
     * A CSS selector used to initialize the outer select context for synchronous extraction.
     * When provided, the matching nodes become the initial `__context` stack entry, scoping
     * all subsequent select operations. Intended for use with `extractSync()`.
     */
    context?: string;

    /**
     * The original target URL before any navigations or redirects during extraction.
     * Captured by the host at the start of extraction and returned in the final result
     * for debugging and provenance tracking.
     */
    originalUrl?: string;

    /**
     * List of browser API property paths to restore from an unpatched iframe context
     * (e.g. `["Navigator.prototype.sendBeacon"]`). Used to bypass website monkey-patching
     * of native APIs that may interfere with extraction.
     */
    unpatch: string[];

    /** Version identifier for the extraction engine. */
    version: string;
}
