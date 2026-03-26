import { When } from "./When.js";

/**
 * Invokes a Playwright locator on the page by yielding control to the host,
 * which calls `page.locator(selector)` (and optionally `page.frameLocator(frame)`)
 * to interact with DOM elements that are not reachable via standard CSS/jQuery
 * selectors — such as elements inside iframes or shadow DOM trees.
 *
 * The result is stored in `state.vars[name]` (when `name` starts with `_`) so
 * subsequent actions can reference it. Multiple locators can be specified in a
 * single action; each is evaluated independently, and results that start with
 * `_` are fed forward into the next extraction iteration via `state.vars`.
 *
 * Only executes in online (browser) mode — ignored during offline extraction.
 *
 * @example
 * // Locate an iframe and extract all inner text from it
 * { locator: [{ name: "_iframe_text", frame: "#howto_iframe", selector: "body", method: "allInnerTexts" }] }
 *
 * @example
 * // Extract an attribute from a shadow-root element
 * { locator: [{ name: "_img_src", selector: "img.shadow-root", method: "getAttribute", params: ["src"] }] }
 *
 * @example
 * // Promote a shadow root into the top-level DOM for subsequent selectors
 * { locator: [{ name: "_shadow", selector: "#my-component", promote: true }] }
 *
 * @example
 * // Chain locators — the second locator is scoped to the result of the first
 * { locator: [
 *     { name: "_container", selector: "#app-shell" },
 *     { name: "_value", selector: ".price", method: "textContent", chain: true }
 * ] }
 *
 * @example
 * // Conditionally run a locator only when a value was previously extracted
 * { locator: [{ name: "_detail", selector: ".info", method: "innerHTML", when: "$.hasDetail" }] }
 */
export interface Locator {
    /**
     * Name of the intermediate property where the host stores the locator
     * result. The value is fed forward into the next extraction iteration
     * via `state.vars`. Names starting with `_` are automatically processed
     * by the host (e.g. `"_value"`, `"_iframe_text"`).
     */
    name: string;

    /**
     * A selector passed to Playwright's `page.frameLocator()` to target an
     * iframe before locating the element. When specified, the locator operates
     * within the context of the matched frame.
     *
     * @example
     * // Target an element inside an iframe
     * { name: "_text", frame: "#howto_iframe", selector: "body", method: "allInnerTexts" }
     */
    frame?: string;

    /**
     * The selector passed to Playwright's `page.locator()` to match one or
     * more DOM elements. Supports expression evaluation — template variables
     * and extracted values can be interpolated at runtime.
     */
    selector: string;

    /**
     * Name of a Playwright {@link https://playwright.dev/docs/api/class-locator | Locator} method
     * to invoke on the matched element(s), such as `"getAttribute"`,
     * `"allTextContents"`, `"textContent"`, `"innerHTML"`, or `"allInnerTexts"`.
     * When omitted, the locator matches elements without calling a method —
     * useful with `promote` or `chain`.
     *
     * @example
     * // Call getAttribute with a parameter
     * { name: "_src", selector: "img", method: "getAttribute", params: ["src"] }
     */
    method?: LocatorMethod;

    /**
     * Parameters passed to the locator {@link method}. Each parameter is
     * evaluated at runtime, supporting expression interpolation.
     *
     * @example
     * // Pass "src" as the argument to getAttribute
     * { name: "_src", selector: "img", method: "getAttribute", params: ["src"] }
     */
    params?: unknown[];

    /**
     * Directs the host to promote the shadow root from the matched element
     * into the top-level DOM, making its contents accessible to subsequent
     * CSS/jQuery selectors in later actions.
     *
     * @example
     * // Promote a web component's shadow DOM so standard selectors can reach it
     * { name: "_shadow", selector: "#my-component", promote: true }
     */
    promote?: boolean;

    /**
     * Chains this locator to the previous locator in the array, so it operates
     * within the scope of the previously matched element rather than the full
     * page. Defaults to `false`.
     *
     * @example
     * // Chain a second locator to scope it within the first match
     * { locator: [
     *     { name: "_container", selector: "#app-shell" },
     *     { name: "_price", selector: ".price", method: "textContent", chain: true }
     * ] }
     */
    chain?: boolean;

    /**
     * Expression that controls whether this locator executes.
     * When the expression evaluates to a falsy value the locator is skipped.
     */
    when?: When;
}

/**
 * A Playwright {@link https://playwright.dev/docs/api/class-locator | Locator} method name
 * to invoke on matched elements. Common methods include `"getAttribute"`,
 * `"textContent"`, `"innerHTML"`, `"allTextContents"`, and `"allInnerTexts"`.
 */
export type LocatorMethod = string;
