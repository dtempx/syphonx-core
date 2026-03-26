import { DocumentLoadState } from "./DocumentLoadState.js";
import { LocatorMethod} from "./Locator.js";
import { When } from "./When.js";

/**
 * Yields control back to the Playwright host, suspending engine execution until
 * the host re-enters. Used as a standalone action to pause between steps —
 * for example, after a separate `click` action that triggers a navigation.
 * Only executes in online (browser) mode — ignored during offline extraction.
 *
 * The host resumes extraction from the step immediately following the yield,
 * passing the updated page state back into the engine via {@link YieldState}.
 * Use `params` to instruct the host to perform a specific action (navigate,
 * reload, screenshot, etc.) before re-entering. When `params` is omitted the
 * host simply waits for the page to settle before re-entering.
 *
 * @example
 * // Separate click + yield (online/2a pattern):
 * { "click": { "query": [["a"]] } }
 * { "yield": {} }
 */
export interface Yield {
    /** Optional label used in log output (e.g. `YIELD myStep`). */
    name?: string;

    /**
     * Parameters that instruct the host which action to perform before
     * re-entering the engine. When omitted, the host waits for the page
     * to settle (approximately 1 second) and then re-enters.
     */
    params?: YieldParams;

    /** Expression that controls whether this action executes. Skips the yield when falsy. */
    when?: When;
}

/**
 * Describes the host-side action to perform during a yield, along with shared
 * options that apply to any action that involves page navigation or loading.
 * Exactly one action key (`click`, `goback`, `locators`, `navigate`, `reload`,
 * `screenshot`) should be set; if none is set, the host waits and re-enters.
 */
export interface YieldParams extends Record<string, unknown> {
    /**
     * Maximum time in milliseconds the host should wait for the action to
     * complete. Falls back to the template-level timeout when omitted.
     */
    timeout?: number;

    /**
     * The navigation/load state the Playwright host should wait for after
     * any action that causes a page load (e.g. `"load"`, `"domcontentloaded"`,
     * `"networkidle"`). Falls back to the template-level `waitUntil` when omitted.
     */
    waitUntil?: DocumentLoadState;

    /**
     * Signals that the preceding click (already fired inside the engine) may
     * have triggered a navigation. The host waits for the page to settle using
     * `waitUntil` before re-entering. Set by the `click` action when `yield`
     * is `true` on the {@link Click} interface.
     */
    click?: {};

    /**
     * Instructs the host to navigate back in the browser history (equivalent
     * to pressing the Back button) before re-entering the engine.
     */
    goback?: {};

    /**
     * One or more Playwright locator operations for the host to execute and
     * feed back into the engine as template variables. Each entry specifies
     * a selector and method; results are stored in `state.vars` under the
     * locator's `name` key for use in subsequent actions.
     */
    locators?: YieldLocator[];

    /**
     * Instructs the host to navigate to the specified URL before re-entering
     * the engine. The engine updates `state.url` before making this request.
     */
    navigate?: YieldNavigate;

    /**
     * Instructs the host to reload the current page before re-entering
     * the engine.
     */
    reload?: {};

    /**
     * Instructs the host to take a screenshot before re-entering the engine.
     * Supports targeting a specific element via `selector`, capturing the full
     * page, or writing to a named file.
     */
    screenshot?: YieldScreenshot;
}

/**
 * Describes a single Playwright locator operation for the host to execute
 * during a yield. Results are fed back into the engine as template variables
 * so subsequent actions can use values from the live DOM that are not directly
 * accessible to the in-page engine (e.g. shadow DOM, iframes).
 */
export interface YieldLocator {
    /** Variable name under which the result is stored in `state.vars`. Must start with `_`. */
    name: string;

    /** CSS selector passed to `page.locator()` (or `page.frameLocator()` when `frame` is set). */
    selector: string;

    /**
     * Name of the Playwright locator method to call (e.g. `"getAttribute"`,
     * `"allTextContents"`, `"inputValue"`).
     * See https://playwright.dev/docs/api/class-locator for available methods.
     */
    method: LocatorMethod;

    /** Positional arguments forwarded to the locator method call. */
    params?: unknown[];

    /** CSS selector passed to `page.frameLocator()` to scope the locator to a specific iframe. */
    frame?: string;
}

/**
 * Payload for a host-side navigation yield. The host navigates to `url` and
 * waits for the page to reach the load state specified by `YieldParams.waitUntil`
 * before re-entering the engine.
 */
export interface YieldNavigate {
    /** The URL the host should navigate to. */
    url: string;
}

/**
 * Options for a host-side screenshot yield. The host captures the screenshot
 * according to these options before re-entering the engine.
 */
export interface YieldScreenshot {
    [key: string]: unknown;

    /** Optional filename or identifier for the screenshot. */
    name?: string;

    /** CSS selector of the element to capture. When omitted, captures the viewport (or full page). */
    selector?: string;

    /** When `true`, captures the entire scrollable page rather than just the visible viewport. */
    fullPage?: boolean;
}

/**
 * Serializable snapshot of the engine's execution position at the point of a
 * yield. Passed between the engine (running inside the browser) and the host
 * (Playwright/Node.js) so the engine can resume from exactly where it stopped.
 */
export interface YieldState {
    /**
     * The action-path index array that identifies the yield point within the
     * action tree. On re-entry, the engine uses this to skip already-completed
     * actions and resume from the step immediately after the yield.
     */
    step: number[];

    /**
     * The host-side action to perform before re-entering the engine.
     * Mirrors {@link YieldParams} — present when an action (click, navigate,
     * etc.) needs the host to do work; absent for a bare settle-and-re-enter yield.
     */
    params?: YieldParams;

    /**
     * Nesting depth within `each` loops at the point of the yield.
     * Used by the host to restore the correct loop context on re-entry.
     */
    level?: number;

    /**
     * Optional value the host can inject back into the engine on re-entry
     * (e.g. the result of a locator operation). Available to subsequent actions
     * via template variable references.
     */
    result?: unknown;
}
