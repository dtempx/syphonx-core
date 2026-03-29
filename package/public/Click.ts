import { DocumentLoadState } from "./DocumentLoadState.js";
import { SelectQuery } from "./Select.js";
import { SnoozeInterval } from "./Snooze.js";
import { WaitFor } from "./WaitFor.js";
import { When } from "./When.js";

/**
 * Simulates a user click on a DOM element matched by a CSS/jQuery/XPath selector.
 * Only executes in online (browser) mode — ignored during offline extraction.
 * For `<select>/<option>` elements, sets the select value and dispatches `change`
 * and `input` events instead of calling `.click()` directly.
 */
export interface Click {
    /** Optional label used in log output (e.g. `CLICK myButton`). */
    name?: string;

    /** One or more selector queries to locate the target element. The first matched node is clicked. */
    query: SelectQuery[];

    /**
     * Condition to wait for after the click before continuing.
     * Skipped entirely if no nodes are matched by `query`.
     * If the wait times out, a `click-timeout` error is appended.
     */
    waitfor?: WaitFor;

    /**
     * Pause (in seconds) to insert before and/or after the click.
     * Tuple form: `[seconds]`, `[min, max]`, or `[min, max, mode]`
     * where `mode` is `"before"` (default), `"after"`, or `"before-and-after"`.
     */
    snooze?: SnoozeInterval;

    /**
     * When `true`, appends a `click-required` error and halts processing
     * if no element is found matching `query`.
     */
    required?: boolean;

    /** @deprecated Not implemented. */
    retry?: number;

    /**
     * When `true`, yields control back to the Playwright host after clicking
     * instead of continuing execution inline. Useful when the click triggers
     * a navigation or full-page update that must be handled by the host.
     * Use `waitUntil` to control the navigation state the host waits for.
     */
    yield?: boolean;

    /**
     * The navigation/load state the Playwright host should wait for after
     * a yielded click (e.g. `"load"`, `"domcontentloaded"`, `"networkidle"`).
     * Only relevant when `yield` is `true`.
     */
    waitUntil?: DocumentLoadState;

    /**
     * When `true` (default), scrolls the element into view before clicking.
     * Set to `false` to skip scrolling and click immediately.
     */
    scroll?: boolean;

    /** Expression that controls whether this action executes. Skips the click when falsy. */
    when?: When;
}
