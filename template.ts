import { Action, DocumentLoadState } from "./package/index.js";

/**
 * Represents a SyphonX extraction template.
 *
 * A template is a declarative JSON structure that defines how to extract structured data from HTML.
 * It contains a set of actions (select, click, navigate, transform, etc.) along with configuration
 * for the browser environment when running online. Templates can be executed offline against static
 * HTML via cheerio, or online inside a live browser via Playwright.
 */
export interface Template {
    /**
     * The ordered set of actions to execute during extraction.
     * Actions are dispatched sequentially by the controller and may be nested (e.g. inside
     * `each`, `repeat`, or `switch` actions). Nested actions are recursively flattened during processing.
     */
    actions: Action[];
    /**
     * Default URL to navigate to before extraction begins.
     * Can be overridden at runtime via options. Supports formula expansion using template params
     * (e.g. `"https://example.com/search?q={params.query}"`).
     */
    url?: string;
    /**
     * Template-level parameters accessible in formulas as `params.<key>`.
     * Used for parameterizing URLs, selectors, and other dynamic values within the template.
     * Runtime params override template params when both are provided.
     */
    params?: Record<string, unknown>;
    /**
     * Initial variables available in the extraction context.
     * These are merged into the extraction state and can be referenced during action execution.
     */
    vars?: Record<string, unknown>;
    /**
     * Enables verbose debug logging throughout extraction.
     * When true, the controller emits detailed log messages and postMessage debug updates
     * during action processing. Can also be enabled via runtime options.
     */
    debug?: boolean;
    /**
     * HTTP User-Agent string for the browser context.
     * Sets the User-Agent header for all page requests when running online via Playwright.
     */
    useragent?: string;
    /**
     * Custom HTTP headers applied to all page requests when running online.
     * Template headers override any default headers set by the host environment.
     */
    headers?: Record<string, string>;
    /**
     * Timeout interval in seconds for page navigation, reload, and goback operations.
     * Converted to milliseconds internally for Playwright navigation calls.
     */
    timeout?: number;
    /**
     * List of browser API property paths to restore from an unpatched iframe context.
     * Used to bypass website monkey-patching of native browser APIs that may interfere
     * with extraction (e.g. `["Navigator.prototype.sendBeacon"]`).
     */
    unpatch?: string[];
    /**
     * Browser viewport dimensions for the page when running online.
     * Overrides the default viewport size (1366x768).
     */
    viewport?: { width: number, height: number };
    /**
     * Document load state to wait for during navigation operations.
     * Controls when navigation is considered complete. Can be overridden per individual
     * yield operation during extraction.
     */
    waitUntil?: DocumentLoadState;
}
