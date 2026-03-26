import { When } from "./When.js";

/**
 * Dispatches a synthetic `keydown` keyboard event on the document.
 * Only executes in online (browser) mode — silently bypassed during
 * offline extraction.
 *
 * The engine constructs a `KeyboardEvent("keydown", …)` with the
 * specified `key` and optional modifier flags, then calls
 * `document.dispatchEvent()`. This triggers any `keydown` listeners
 * attached to the document, which is useful for interacting with pages
 * that respond to keyboard shortcuts or key-driven UI updates.
 *
 * @example
 * // Press the "A" key and then extract the value written by the page's keydown listener
 * {
 *   "actions": [
 *     { "keypress": { "key": "A" } },
 *     { "select": [{ "name": "keypress", "query": [["#keypress"]] }] }
 *   ]
 * }
 *
 * @example
 * // Press Escape with a descriptive name (appears in log output as "KEYPRESS close-modal")
 * { "keypress": { "name": "close-modal", "key": "Escape" } }
 *
 * @example
 * // Press Ctrl+A to select all, conditional on a when expression
 * { "keypress": { "key": "a", "control": true, "when": "$.ready" } }
 */
export interface KeyPress {
    /** Optional label used in log output (e.g. `KEYPRESS close-modal`). */
    name?: string;

    /**
     * The key value to send in the keyboard event. Corresponds to the
     * `KeyboardEvent.key` property (e.g. `"A"`, `"Enter"`, `"Escape"`).
     * Also used to derive `code`, `keyCode`, and `which` via
     * `"Key" + key.toUpperCase()` and `key.charCodeAt(0)`.
     */
    key: string;

    /** When `true`, sets `shiftKey` on the dispatched `KeyboardEvent`. */
    shift?: boolean;

    /** When `true`, sets `ctrlKey` on the dispatched `KeyboardEvent`. */
    control?: boolean;

    /** When `true`, sets `altKey` on the dispatched `KeyboardEvent`. */
    alt?: boolean;

    /** Expression that controls whether this action executes. Skips the keypress when falsy. */
    when?: When;
}
