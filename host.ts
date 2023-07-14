import { attempt } from "./lib/attempt.js";
import { evaluateFormula } from "./lib/formula.js";
import { sleep } from "./lib/sleep.js";
import { unwrap } from "./lib/unwrap.js";
import { parseUrl, isFormula, merge } from "./extract/lib/index.js";
import { Template } from "./template.js";

import {
    DocumentLoadState,
    ExtractResult,
    ExtractState,
    YieldLocator,
    YieldNavigate,
    YieldParams,
    YieldScreenshot
} from "./extract/index.js";

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

export interface NavigateResult {
    status?: number;
}

export interface HostOptions {
    template: Template;
    url?: string;
    params?: Record<string, unknown>;
    unwrap?: boolean;
    debug?: boolean;
    extractHtml?: boolean;
    maxYields?: number;
    retries?: number;
    retryDelay?: number[];
    onExtract?: (state: ExtractState, script: string) => Promise<ExtractState>;
    onGoback?: (options: { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    onHtml?: () => Promise<string>;
    onLocator?: (options: YieldLocator) => Promise<unknown>;
    onNavigate?: (options: YieldNavigate & { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    onReload?: (options: { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    onScreenshot?: (options: YieldScreenshot) => Promise<void>;
    onYield?: (params: YieldParams) => Promise<void>;
}

export async function host({ maxYields = 1000, retries, retryDelay, ...options}: HostOptions): Promise<ExtractResult> {
    if (!options.template)
        throw new Error("template not specified");

    let url = options.url || options.template.url;
    if (!url || typeof url !== "string")
        throw new Error("url not specified");

    if (!options.onNavigate)
        throw new Error("onNavigate not specified");

    if (!options.onExtract)
        throw new Error("onExtract not specified");

    if (isFormula(url))
        url = encodeURI(evaluateFormula(url.slice(1, -1), { params: options.template.params }) as string);

    const originalUrl = url;
    const { domain, origin } = parseUrl(url); // take domain and origin from the original url

    const params = merge(options.template.params, options.params); // options.params overrides template.params
    const timeout = typeof options.template.timeout === "number" ? options.template.timeout * 1000 : undefined;
    const waitUntil = options.template.waitUntil;

    const attemptOptions = {
        retries,
        retryDelay
    };

    let lastNavigationResult: NavigateResult | undefined = undefined;
    await attempt(
        async () => {
            lastNavigationResult = await options.onNavigate!({ url: url!, timeout, waitUntil });
        },
        attemptRetryable,
        attemptOptions
    );

    let state = {
        ...options.template,
        url,
        params,
        vars: {},
        debug: options.debug || options.template.debug
    } as ExtractState;

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
            lastNavigationResult = await options.onGoback({
                timeout: state.yield.params.timeout || timeout,
                waitUntil: state.yield.params.waitUntil || waitUntil
            });
        }
        else if (state.yield.params?.locators && options.onLocator) {
            for (const locator of state.yield.params.locators)
                if (locator.name?.startsWith("_") && locator.selector && locator.method)
                    state.vars[locator.name] = await options.onLocator(locator);
        }
        else if (state.yield.params?.navigate && options.onNavigate) {
            if (state.yield.params.navigate.url) {
                state.url = state.yield.params.navigate.url;
                const obj = {
                    ...state.yield.params.navigate,
                    timeout: state.yield.params.timeout || timeout,
                    waitUntil: state.yield.params.waitUntil || waitUntil
                };
                await attempt(
                    async () => {
                        lastNavigationResult = await options.onNavigate!(obj);
                    },
                    attemptRetryable,
                    attemptOptions
                );
            }
        }
        else if (state.yield.params?.reload && options.onReload) {
            lastNavigationResult = await options.onReload({
                timeout: state.yield.params.timeout || timeout,
                waitUntil: state.yield.params.waitUntil || waitUntil
            });
        }
        else if (state.yield.params?.screenshot && options.onScreenshot) {
            await options.onScreenshot(state.yield.params.screenshot);
        }
        else if (state.yield.params?.waitUntil && options.onYield) {
            await sleep(1000); // wait for the page to settle
            await options.onYield(state.yield.params);
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

    return { 
        ...state,
        ok: state.errors ? state.errors.length === 0 : true,
        status: lastNavigationResult?.status,
        html,
        originalUrl,
        domain,
        origin,
        data: options.unwrap ? unwrap(state.data) : state.data,
        online: true
    };
}

export async function invokeAsyncMethod(obj: {}, method: string, args: unknown[] = []): Promise<unknown> {
    const fn = (obj as Record<string, (...args: unknown[]) => unknown>)[method];
    if (typeof fn === "function") {
        const result = await fn(...args);
        return result;
    }
}

function attemptRetryable(err: unknown): boolean {
    const code = createErrorCode(err);
    return retryableErrorCodes.includes(code);
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

export interface AttemptOptions {
    retries: number;
}

export const script = "";
