import { Break } from "./Break.js";
import { Click } from "./Click.js";
import { Each } from "./Each.js";
import { Error } from "./Error.js";
import { GoBack } from "./GoBack.js";
import { KeyPress } from "./KeyPress.js";
import { Locator } from "./Locator.js";
import { Navigate } from "./Navigate.js";
import { Reload } from "./Reload.js";
import { Repeat } from "./Repeat.js";
import { Screenshot } from "./Screenshot.js";
import { Scroll } from "./Scroll.js";
import { Select } from "./Select.js";
import { Snooze } from "./Snooze.js";
import { Switch } from "./Switch.js";
import { Transform } from "./Transform.js";
import { WaitFor } from "./WaitFor.js";
import { Yield } from "./Yield.js";

/**
 * A discriminated union of all possible template actions. Each action is a
 * single-key object whose key identifies the action type and whose value
 * holds the action's configuration.
 *
 * Actions are the building blocks of a SyphonX template. A template's
 * `actions` array is an ordered sequence of `Action` objects that the
 * engine executes top-to-bottom. Some actions are **online-only** (they
 * require a live browser and are silently skipped in offline/cheerio mode),
 * while others work in both modes.
 *
 * **Categories:**
 * - **Data extraction:** {@link SelectAction}, {@link TransformAction}
 * - **Control flow:** {@link RepeatAction}, {@link EachAction}, {@link SwitchAction}, {@link BreakAction}
 * - **Browser interaction:** {@link ClickAction}, {@link ScrollAction}, {@link KeyPressAction}, {@link LocatorAction}
 * - **Navigation:** {@link NavigateAction}, {@link GoBackAction}, {@link ReloadAction}
 * - **Timing / async:** {@link SnoozeAction}, {@link WaitForAction}, {@link YieldAction}
 * - **Diagnostics:** {@link ErrorAction}, {@link ScreenshotAction}
 *
 * @example
 * // A minimal template with two actions: extract the page title
 * {
 *   "actions": [
 *     { "select": [{ "name": "title", "query": [["h1"]] }] },
 *     { "transform": [{ "query": ["p", ["replaceText", "{value.trim()}"]] }] }
 *   ]
 * }
 */
export type Action =
      BreakAction
    | ClickAction
    | EachAction
    | ErrorAction
    | GoBackAction
    | KeyPressAction
    | LocatorAction
    | NavigateAction
    | ReloadAction
    | RepeatAction
    | ScreenshotAction
    | ScrollAction
    | SelectAction
    | SnoozeAction
    | SwitchAction
    | TransformAction
    | WaitForAction
    | YieldAction;

/**
 * Conditionally exits the enclosing {@link RepeatAction | repeat} or
 * {@link EachAction | each} loop. Online-only — bypassed in offline mode.
 * Evaluates an optional `when` guard and/or a DOM `query` to decide whether
 * to break. Commonly used to detect the end of pagination (e.g. a "next"
 * button disappearing).
 *
 * @example
 * { "break": { "query": [["#next"]], "on": "none" } }
 */
export type BreakAction = { break: Break };

/**
 * Simulates a user click on a DOM element matched by a CSS/jQuery/XPath
 * selector. Online-only. Supports post-click waiting ({@link WaitFor}),
 * snooze delays, and yielding to the host for navigation-triggering clicks.
 *
 * @example
 * { "click": { "query": [["a.next"]], "waitfor": { "query": [["h1"]] } } }
 */
export type ClickAction = { click: Click };

/**
 * Iterates over DOM elements matched by a `query`, running a sequence of
 * nested `actions` once per element with that element set as the active
 * context. Works in both online and offline modes.
 *
 * @example
 * { "each": { "query": [["ul > li"]], "actions": [{ "select": [{ "name": "item", "repeated": true, "query": [["."]] }] }] } }
 */
export type EachAction = { each: Each };

/**
 * Defines a conditional error that fires based on a DOM query or a `when`
 * expression. Controls severity via `level` (0 = fatal, 1 = retryable) and
 * can halt or continue processing. Works in both online and offline modes.
 *
 * @example
 * { "error": { "when": "{_status === 'blocked'}", "message": "Page is blocked", "level": 0 } }
 */
export type ErrorAction = { error: Error };

/**
 * Navigates the browser back in history (equivalent to pressing the Back
 * button). Online-only. Yields to the Playwright host which calls
 * `page.goBack()`.
 *
 * @example
 * { "goback": {} }
 */
export type GoBackAction = { goback: GoBack };

/**
 * Dispatches a synthetic `keydown` keyboard event on the document.
 * Online-only. Useful for interacting with pages that respond to keyboard
 * shortcuts or key-driven UI updates.
 *
 * @example
 * { "keypress": { "key": "Escape" } }
 */
export type KeyPressAction = { keypress: KeyPress };

/**
 * Invokes one or more Playwright locators to access DOM elements not
 * reachable via standard selectors — such as elements inside iframes or
 * shadow DOM trees. Online-only. Results are stored as template variables
 * for use in subsequent actions.
 *
 * @example
 * { "locator": [{ "name": "_text", "frame": "#iframe", "selector": "body", "method": "allInnerTexts" }] }
 */
export type LocatorAction = { locator: Locator[] };

/**
 * Navigates the browser to a URL by yielding to the Playwright host.
 * Online-only. The URL supports expression interpolation for dynamic
 * navigation based on previously extracted values.
 *
 * @example
 * { "navigate": { "url": "https://example.com/page/{_nextPage}" } }
 */
export type NavigateAction = { navigate: Navigate };

/**
 * Reloads the current page by yielding to the Playwright host. Online-only.
 * Optionally waits for a specific load state before continuing.
 *
 * @example
 * { "reload": { "waitUntil": "networkidle" } }
 */
export type ReloadAction =  { reload: Reload };

/**
 * Loops a sequence of `actions` up to `limit` times, without tying
 * iterations to specific DOM elements. Typically used for open-ended
 * pagination or polling where the stopping condition is determined at
 * runtime (e.g. a "next" button disappearing). Works in both online and
 * offline modes.
 *
 * @example
 * { "repeat": { "limit": 10, "actions": [
 *     { "select": [{ "name": "titles", "repeated": true, "query": [["h1"]] }] },
 *     { "break": { "query": [["#next"]], "on": "none" } },
 *     { "click": { "query": [["#next"]] } }
 * ] } }
 */
export type RepeatAction = { repeat: Repeat };

/**
 * Captures a screenshot by yielding to the Playwright host. Online-only.
 * Can target a specific element via `selector` or capture the full page.
 *
 * @example
 * { "screenshot": { "name": "homepage", "fullPage": true } }
 */
export type ScreenshotAction = { screenshot: Screenshot };

/**
 * Scrolls the page to the top/bottom or scrolls a specific element into
 * view. Online-only. Commonly used inside repeat loops to trigger
 * infinite-scroll loading.
 *
 * @example
 * { "scroll": { "target": "bottom" } }
 */
export type ScrollAction = { scroll: Scroll };

/**
 * Extracts data from the DOM using CSS/jQuery/XPath selectors. This is the
 * primary data-extraction action and the heart of most templates. Each entry
 * in the array defines a named (or unnamed/projected) data field with its
 * query, type coercion, formatting, and optional sub-selections for nested
 * object structures. Works in both online and offline modes.
 *
 * @example
 * { "select": [{ "name": "title", "query": [["h1"]] }, { "name": "price", "type": "number", "query": [["span.price"]] }] }
 */
export type SelectAction = { select: Select[] };

/**
 * Pauses execution for a specified duration. Online-only — in offline mode
 * the snooze is logged but skipped entirely. Accepts shorthand forms: a bare
 * number (`60`), a single-element tuple (`[60]`), a range (`[1, 2]`), or the
 * full {@link Snooze} object with `interval` and optional `when` guard.
 *
 * @example
 * { "snooze": [1, 2] }
 *
 * @example
 * { "snooze": { "interval": [0.5, 1], "when": "{_shouldPause}" } }
 */
export type SnoozeAction = { snooze: Snooze | number | [number] | [number, number] };

/**
 * Conditional branching — evaluates an ordered array of cases and runs the
 * `actions` of the first case whose `query` matches (or whose `when`
 * expression is truthy). A case with no `query` acts as a default/fallback.
 * Works in both online and offline modes.
 *
 * @example
 * { "switch": [
 *     { "query": [["h1:contains('News')"]], "actions": [{ "select": [{ "name": "content", "query": [["p"]] }] }] },
 *     { "actions": [{ "select": [{ "name": "content", "query": [["i"]] }] }] }
 * ] }
 */
export type SwitchAction = { switch: Switch[] };

/**
 * Applies in-place DOM mutations using jQuery operations such as
 * `replaceWith`, `replaceText`, `addClass`, `attr`, `wrap`, `map`, and
 * `filter`. Unlike `select` (which reads the DOM), `transform` writes back
 * to the DOM, reshaping page HTML before or between extraction steps. Works
 * in both online and offline modes (except `autopaginate`, which is
 * online-only).
 *
 * @example
 * { "transform": [{ "query": ["h3", ["replaceWith", "{`<p>${value}</p>`}"]] }] }
 */
export type TransformAction = { transform: Transform[] };

/**
 * Polls the DOM until a condition is met or a timeout expires. Used as a
 * standalone action to wait for elements to appear, or embedded inside
 * {@link Click} to wait after a click. Online-only. Specify `query` to wait
 * for a selector match, or `select` to wait for a boolean extraction to
 * become truthy.
 *
 * @example
 * { "waitfor": { "query": [["h1"]], "required": true, "timeout": 5 } }
 */
export type WaitForAction = { waitfor: WaitFor };

/**
 * Yields control back to the Playwright host, suspending engine execution
 * until the host re-enters. Online-only. Use `params` to instruct the host
 * to perform a specific action (navigate, reload, screenshot, etc.) before
 * re-entering. When `params` is omitted the host waits for the page to
 * settle before resuming.
 *
 * @example
 * { "yield": { "params": { "waitUntil": "domcontentloaded" } } }
 */
export type YieldAction = { yield: Yield };

/**
 * A string literal union of all action type keys. Corresponds to the
 * property name used to identify each action in the discriminated
 * {@link Action} union (e.g. `"select"`, `"click"`, `"repeat"`).
 */
export type ActionType =
  "break" |
  "click" |
  "each" |
  "error" |
  "goback" |
  "locator" |
  "keypress" |
  "navigate" |
  "reload" |
  "repeat" |
  "screenshot" |
  "scroll" |
  "select" |
  "snooze" |
  "switch" |
  "transform" |
  "waitfor" |
  "yield";
  