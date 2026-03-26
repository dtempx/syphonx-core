import { When } from "./When.js";

/**
 * Captures a screenshot by yielding control to the Playwright host.
 * Only executes in online (browser) mode — ignored during offline extraction.
 *
 * When the engine encounters a screenshot action it yields to the host with
 * an `"action": "screenshot"` param. The host invokes its `onScreenshot`
 * callback (see {@link YieldScreenshot}), captures the image, and re-enters
 * the engine. The `selector` field supports template expressions and is
 * evaluated at runtime via the engine's expression evaluator.
 *
 * @example
 * // Capture a full-page screenshot with a custom name
 * { "screenshot": { "name": "homepage", "fullPage": true } }
 *
 * @example
 * // Capture a specific element
 * { "screenshot": { "selector": "#main-content" } }
 *
 * @example
 * // Conditional screenshot — only when a variable is truthy
 * { "screenshot": { "name": "debug", "when": "{_debug}" } }
 *
 * @example
 * // Pass additional host-specific params (e.g. quality, format)
 * { "screenshot": { "name": "hero", "params": { "quality": 80, "type": "jpeg" } } }
 */
export interface Screenshot {
    /** Optional filename or identifier for the screenshot (appears in log output as `SCREENSHOT <name>`). */
    name?: string;

    /**
     * CSS selector of the element to capture. Supports template expressions
     * (e.g. `"{_selector}"`) that are evaluated at runtime. When omitted,
     * captures the viewport (or the full page if `fullPage` is `true`).
     */
    selector?: string;

    /** When `true`, captures the entire scrollable page rather than just the visible viewport. */
    fullPage?: boolean;

    /**
     * Additional key-value pairs forwarded to the host's `onScreenshot` callback.
     * Use this to pass host-specific options such as image format, quality, or
     * output path that are not part of the core screenshot interface.
     */
    params?: Record<string, unknown>;

    /** Expression that controls whether this action executes. Skips the screenshot when falsy. */
    when?: When;
}
