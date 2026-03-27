import { attempt, evaluateFormula, sleep, unwrap } from "./lib/index.js";
import { isFormula, merge, parseUrl, Timer } from "./package/lib/index.js";
import { flattenTemplateActions } from "./package/utilities.js";
import { Template } from "./template.js";
import { Metrics } from "./package/public/index.js";

import {
    DocumentLoadState,
    ExtractResult,
    ExtractState,
    Select,
    Transform,
    YieldLocator,
    YieldNavigate,
    YieldParams,
    YieldScreenshot
} from "./package/index.js";

type ErrorCode =
    "ERR_TARGET_CLOSED" |
    "ERR_NAVIGATION" |  
    "ERR_TIMEOUT" |
    "ERR_UNKNOWN";

const retryableErrorCodes: ErrorCode[] = [
    "ERR_TARGET_CLOSED",
    "ERR_NAVIGATION",
    "ERR_TIMEOUT"
];

/** Result returned by navigation callbacks. */
export interface NavigateResult {
    /** HTTP status code from the navigation response. */
    status?: number;
}

/**
 * Configuration options for the {@link host} function.
 *
 * Provides the extraction template, runtime parameters, and callback hooks that
 * the host environment (e.g. Playwright) implements to perform browser actions
 * on behalf of the extraction engine.
 */
export interface HostOptions {
    /** The extraction template defining actions, selectors, and settings. */
    template: Template;
    /** URL to navigate to. Overrides `template.url` when provided. Supports formula expansion. */
    url?: string;
    /** Runtime parameters merged on top of `template.params`. Used in formula evaluation and URL expansion. */
    params?: Record<string, unknown>;
    /** When true, unwraps single-element arrays and single-property objects in the final result data. */
    unwrap?: boolean;
    /** Enables verbose debug logging in the extraction engine. */
    debug?: boolean;
    /** When true, captures the page HTML after extraction via the {@link HostOptions.onHtml} callback. */
    extractHtml?: boolean;
    /** Maximum number of yield/re-enter cycles before the host loop terminates. Defaults to 1000. */
    maxYields?: number;
    /** Number of retry attempts for retryable errors (e.g. target closed, navigation, timeout). */
    retries?: number;
    /** Delay in seconds between successive retries. Each element corresponds to a retry attempt. */
    retryDelay?: number[];
    /** Callback to inject and execute the extraction engine script inside the browser, returning the updated state. */
    onExtract?: (state: ExtractState, script: string) => Promise<ExtractState>;
    /** Callback to navigate the browser back in history. */
    onGoback?: (options: { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    /** Callback to retrieve the current page's serialized HTML. */
    onHtml?: () => Promise<string>;
    /** Callback to execute a Playwright locator operation and return its result. */
    onLocator?: (options: YieldLocator) => Promise<unknown>;
    /** Callback to navigate the browser to a URL. Required. */
    onNavigate?: (options: YieldNavigate & { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    /** Callback to reload the current page. */
    onReload?: (options: { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    /** Callback to capture a screenshot of the page or a specific element. */
    onScreenshot?: (options: YieldScreenshot) => Promise<void>;
    /** Callback invoked for generic yield operations (e.g. waiting for a document load state). */
    onYield?: (params: YieldParams) => Promise<void>;
}

/**
 * Orchestrates an online extraction by navigating to a URL, running the extraction engine
 * inside the browser, and processing yield/re-enter cycles for browser actions (navigate,
 * go back, reload, click, screenshot, locator operations).
 *
 * This is the primary entry point for online (browser-based) extraction. The host function
 * coordinates between the extraction engine running inside the page and the external browser
 * automation layer (e.g. Playwright) via callback hooks provided in {@link HostOptions}.
 *
 * @param options - Configuration including the template, URL, callbacks, and retry settings.
 * @returns The final extraction result with data, errors, metrics, and HTTP status.
 * @throws If `template`, `url`, `onNavigate`, or `onExtract` are not provided.
 * 
 * @example
 * const result = await host({
 *     url,
 *     extractHtml: options.html,
 *     template: {
 *         actions: options.actions,
 *         params: options.params,
 *         vars: options.vars,
 *         debug: options.debug,
 *         timeout
 *     },
 *     onExtract: async (state: ExtractState, script: string) => {
 *         const fn = new Function("state", `return ${script}(state)`);
 *         const result = await page.evaluate<ExtractState, ExtractState>(fn as any, state);
 *         return result;
 *     },
 *     onHtml: async () => {
 *         const html = await page.evaluate(() => document.querySelector("*")!.outerHTML);
 *         return html;
 *     },
 *     onNavigate: async ({ url, timeout, waitUntil }) => {
 *         const response = await page.goto(url, { timeout, waitUntil });
 *         const status = response?.status();
 *         return { status };
 *     },
 *     onYield: async ({ timeout, waitUntil }) => {
 *         await page.waitForLoadState(waitUntil, { timeout });
 *     }
 * });
 * 
 */
export async function host({ maxYields = 1000, retries, retryDelay, ...options}: HostOptions): Promise<ExtractResult> {
    if (!options.template)
        throw new Error("template not specified");

    let url = options.url || options.template.url;
    if (!url || typeof url !== "string")
        throw new Error("url not specified");

    if (!options.onNavigate)
        throw new Error("onNavigate not defined");

    if (!options.onExtract)
        throw new Error("onExtract not defined");

    const timer = new Timer();
    const params = merge(options.template.params, options.params); // options.params overrides template.params
    const timeout = typeof options.template.timeout === "number" ? options.template.timeout * 1000 : undefined;
    const waitUntil = options.template.waitUntil;
    url = expandTemplateUrl(url, params);

    const originalUrl = url;
    const { domain, origin } = parseUrl(url); // take domain and origin from the original url

    let state = {
        ...options.template,
        url,
        params,
        vars: {},
        debug: options.debug || options.template.debug
    } as ExtractState;

    const actions = flattenTemplateActions(options.template.actions);
    state.vars.__metrics = {
        navigate: 0,
        retries: 0,
        actions: actions.length
    };

    const attemptOptions = {
        retries,
        retryDelay
    };

    let lastNavigationResult: NavigateResult = {};
    const navigationTimer = new Timer();
    await attempt(
        async () => {
            lastNavigationResult = await options.onNavigate!({ url: url!, timeout, waitUntil });
        },
        attemptRetryable,
        attemptOptions
    );
    (state.vars.__metrics as Metrics).navigate += navigationTimer.elapsed();
    state.vars.__status = lastNavigationResult?.status;

    await attempt(
        async () => {
            state = await options.onExtract!(state, script || (global as unknown as { script: string }).script);
        },
        attemptRetryable,
        attemptOptions
    );
    
    let i = 0;
    while (state.yield && i++ < maxYields) {
        if (state.yield.params?.goback && options.onGoback) {
            const obj = {
                timeout: state.yield.params.timeout || timeout,
                waitUntil: state.yield.params.waitUntil || waitUntil
            };
            const gobackTimer = new Timer();
            try {
                lastNavigationResult = await options.onGoback(obj);
            }
            catch (err) {
                state.errors.push({ code: "host-error", message: `GOBACK ${err instanceof Error ? err.message : JSON.stringify(err)}`, level: 1 });
            }
            (state.vars.__metrics as Metrics).navigate += gobackTimer.elapsed();
        }
        else if (state.yield.params?.locators && options.onLocator) {
            for (const locator of state.yield.params.locators)
                if (locator.name?.startsWith("_") && locator.selector && locator.method) {
                    try {
                        state.vars[locator.name] = await options.onLocator(locator);
                    }
                    catch (err) {
                        state.errors.push({ code: "host-error", message: `LOCATOR ${JSON.stringify(locator)} ${err instanceof Error ? err.message : JSON.stringify(err)}`, level: 1 });
                        state.vars[locator.name] = null;
                    }
                }
        }
        else if (state.yield.params?.navigate && options.onNavigate) {
            if (state.yield.params.navigate.url) {
                state.url = state.yield.params.navigate.url;
                const obj = {
                    ...state.yield.params.navigate,
                    timeout: state.yield.params.timeout || timeout,
                    waitUntil: state.yield.params.waitUntil || waitUntil
                };
                const renavigationTimer = new Timer();
                await attempt(
                    async () => {
                        lastNavigationResult = await options.onNavigate!(obj);
                    },
                    attemptRetryable,
                    attemptOptions
                );
                (state.vars.__metrics as Metrics).navigate += renavigationTimer.elapsed();
            }
        }
        else if (state.yield.params?.reload && options.onReload) {
            const obj = {
                timeout: state.yield.params.timeout || timeout,
                waitUntil: state.yield.params.waitUntil || waitUntil
            };
            const reloadTimer = new Timer();
            try {
                lastNavigationResult = await options.onReload(obj);
            }
            catch (err) {
                state.errors.push({ code: "host-error", message: `RELOAD ${err instanceof Error ? err.message : JSON.stringify(err)}`, level: 1 });
            }
            (state.vars.__metrics as Metrics).navigate += reloadTimer.elapsed();
        }
        else if (state.yield.params?.screenshot && options.onScreenshot) {
            try {
                await options.onScreenshot(state.yield.params.screenshot);
            }
            catch (err) {
                state.errors.push({ code: "host-error", message: `SCREENSHOT ${state.yield.params.screenshot} ${err instanceof Error ? err.message : JSON.stringify(err)}`, level: 1 });
            }
        }
        else if (state.yield.params?.waitUntil && options.onYield) {
            await sleep(1000); // wait for the page to settle
            try {
                await options.onYield(state.yield.params);
            }
            catch (err) {
                state.errors.push({ code: "host-error", message: `YIELD ${JSON.stringify(state.yield.params)} ${err instanceof Error ? err.message : JSON.stringify(err)}`, level: 1 });
            }
        }
        else {
            await sleep(1000); // wait for the page to settle
        }
        
        await attempt(
            async () => {
                state = await options.onExtract!(state, script || (global as unknown as { script: string }).script);    
            },
            attemptRetryable,
            attemptOptions
        );
    }

    let html = "";
    if (options.extractHtml && options.onHtml)
        html = await options.onHtml();

    const metrics = state.vars.__metrics as Metrics;
    metrics.elapsed = timer.elapsed();
    metrics.errors = state.errors?.length ?? 0;

    return {
        ...state,
        ok: state.errors ? state.errors.length === 0 : true,
        status: lastNavigationResult?.status,
        html,
        originalUrl,
        domain,
        origin,
        metrics,
        data: options.unwrap ? unwrap(state.data) : state.data,
        online: true
    };

    function attemptRetryable(err: unknown): boolean {
        const code = createErrorCode(err);
        if (retryableErrorCodes.includes(code)) {
            (state.vars.__metrics as Metrics).retries += 1;
            return true;
        }
        else {
            return false;
        }
    }    
}

/**
 * Expands a template URL by evaluating it as a formula expression if it is wrapped
 * in formula delimiters (e.g. `{...}`), substituting parameter values and URI-encoding the result.
 * Returns the URL unchanged if it is not a formula.
 *
 * @param url - The URL string, possibly a formula expression.
 * @param params - Parameters available for substitution within the formula.
 * @returns The expanded and URI-encoded URL.
 */
export function expandTemplateUrl(url: string, params?: Record<string, unknown>): string {
    if (isFormula(url))
        url = encodeURI(evaluateFormula(url.slice(1, -1), { params }) as string);
    return url;
}

/**
 * Invokes a named method on an object asynchronously, passing the given arguments.
 * Returns `undefined` if the method does not exist on the object.
 * Provides a generic way to delegate to any playwright locator by method name.
 *
 * @param obj - The target object to invoke the method on.
 * @param method - The name of the method to call.
 * @param args - Arguments to pass to the method.
 * @returns The result of the method call, or `undefined` if the method does not exist.
 * 
 * @example
 * async function onLocator({ frame, selector, method, params }) {
 *    let locator = undefined as playwright.Locator | undefined;
 *    if (frame)
 *        locator = await page.frameLocator(frame).locator(selector);
 *    else
 *        locator = await page.locator(selector);
 *    const result = await invokeAsyncMethod(locator, method, params);
 *    return result;
 * }
 *
 */
export async function invokeAsyncMethod(obj: {}, method: string, args: unknown[] = []): Promise<unknown> {
    const fn = (obj as Record<string, (...args: unknown[]) => unknown>)[method];
    if (typeof fn === "function") {
        const result = await fn.call(obj, ...args);
        return result;
    }
}

function createErrorCode(err: unknown): ErrorCode {
    let message = "";
    if (err instanceof Error)
        message = err.message;
    else if (typeof err === "string")
        message = err;
    else
        message = JSON.stringify(err);

    const [code] = message.match(/ERR_[A-Z_]*/) || [];
    if (code)
        return code as ErrorCode;
    else if (message.includes("Execution context was destroyed") || message.includes("Target closed") || message.includes("document.body is null"))
        return "ERR_TARGET_CLOSED";
    else if (message.toLowerCase().includes("timeout"))
        return "ERR_TIMEOUT";
    else if (message.toLowerCase().includes("navigation"))
        return "ERR_NAVIGATION";
    else
        return "ERR_UNKNOWN";
}

/** Options for configuring retry behavior. */
export interface AttemptOptions {
    /** Number of retry attempts before giving up. */
    retries: number;
}

/**
 * Contains the full SyphonX extraction engine script that can be injected into a browser page context.
 * 
 * @example
 * import * as playwright from 'playwright';
 * import * as syphonx from 'syphonx-core';
 * 
 * const url = 'https://www.example.com/';
 * const template = { actions: [ { select: [{ name: 'title', query: [['h1']] }] } ] };
 * 
 * const browser = await playwright.chromium.launch();
 * const page = await browser.newPage();
 * await page.goto(url);
 * 
 * const result = await page.evaluate(`${syphonx.script}(${JSON.stringify({ ...template, url })})`);
 * console.log(JSON.stringify(result, null, 2));
 *  
 **/
export const script = "";

/**
 * Union type for arguments passed to the in-browser evaluation function.
 * Represents the different modes of invoking the extraction engine:
 * full extraction state, standalone select, standalone transform, or synchronous extraction.
 */
export type EvaluateArg = ExtractState | { select: Select[] } | { transform: Transform[] } | { sync: ExtractState };

/** The result returned by the in-browser evaluation function, representing the updated extraction state. */
export type EvaluateResult = ExtractState;

/** Function signature for invoking the extraction engine inside the browser context. */
export type EvaluateFunction = (arg: EvaluateArg) => Promise<EvaluateResult>;
//export const evaluator = new Function("obj", `return ${script}(obj)`) as EvaluateFunction;
