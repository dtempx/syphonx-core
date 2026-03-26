import { SelectQuery } from "./Select.js";
import { When } from "./When.js";

/**
 * Scrolls the page or a specific element into view.
 *
 * Only executes in online (browser) mode — silently ignored during offline extraction.
 * After triggering the scroll, waits for the animation to finish before continuing
 * to the next action.
 *
 * Use `target` to jump to the top or bottom of the page, or `query` to scroll a
 * specific element into view. If neither is provided, the action logs a warning and
 * is a no-op.
 *
 * @example
 * // Scroll to the bottom of the page (e.g. to trigger infinite-scroll loading)
 * { "scroll": { "target": "bottom" } }
 *
 * @example
 * // Scroll back to the top of the page
 * { "scroll": { "target": "top" } }
 *
 * @example
 * // Scroll a specific element into view using a CSS selector
 * { "scroll": { "query": [["h2:contains('Be in the room with')"]] } }
 *
 * @example
 * // Scroll to the bottom on each repeat iteration to load more content
 * {
 *   "repeat": {
 *     "actions": [
 *       { "select": [{ "name": "count", "query": [["img.item", ["size"]]] }] },
 *       { "scroll": { "target": "bottom" } },
 *       { "waitfor": { "query": [["img.item:nth-child(12)"]] } }
 *     ]
 *   }
 * }
 *
 * @example
 * // Scroll an element into view with custom alignment, snapping instantly
 * { "scroll": { "query": [["#section-3"]], "behavior": "instant", "block": "start" } }
 */
export interface Scroll {
    /** Optional label used in log output (e.g. `SCROLL mySection`). */
    name?: string;

    /**
     * One or more selector queries to locate the element to scroll into view.
     * The first matched element is scrolled into view via `scrollIntoView()`,
     * using `behavior`, `block`, and `inline` to control alignment.
     * Takes effect only when `target` is not set.
     */
    query?: SelectQuery[];

    /**
     * Scrolls to the top or bottom of the page using `window.scrollTo()`.
     * - `"top"` scrolls to `y = 0`.
     * - `"bottom"` scrolls to `y = document.body.scrollHeight`.
     *
     * When omitted and `query` is provided, scrolls the matched element into view instead.
     */
    target?: ScrollTarget;

    /**
     * Controls whether scrolling animates smoothly or jumps instantly to the destination.
     * Maps to the `behavior` option of `window.scrollTo()` and `scrollIntoView()`.
     * Defaults to `"smooth"`.
     */
    behavior?: ScrollBehavior;

    /**
     * Vertical alignment of the element within the viewport when scrolling to a `query` target.
     * Maps to the `block` option of `scrollIntoView()`.
     * Defaults to `"center"`.
     */
    block?: ScrollLogicalPosition;

    /**
     * Horizontal alignment of the element within the viewport when scrolling to a `query` target.
     * Maps to the `inline` option of `scrollIntoView()`.
     * Defaults to `"nearest"`.
     */
    inline?: ScrollLogicalPosition;

    /** Expression that controls whether this action executes. Skips the scroll when falsy. */
    when?: When;
}

/**
 * Specifies a named scroll destination for page-level scrolling.
 * - `"top"` — scrolls to the very top of the page (`y = 0`).
 * - `"bottom"` — scrolls to the very bottom of the page (`y = document.body.scrollHeight`).
 *
 * Used by the `target` property of {@link Scroll}. For element-level scrolling, use `query` instead.
 */
export type ScrollTarget =
      "top"
    | "bottom";
