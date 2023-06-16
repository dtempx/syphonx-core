import { evaluateFormula } from "./lib/formula.js";
import { unwrap } from "./lib/unwrap.js";
import { parseUrl } from "./extract/lib/index.js";
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

export interface NavigateResult {
    status?: number;
}

export interface ExecuteOptions {
    template: Template;
    url?: string;
    unwrap?: boolean;
    debug?: boolean;
    html?: boolean;
    maxYields?: number;
    onExtract: (state: ExtractState, script: string) => Promise<ExtractState>;
    onGoback?: (options: { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    onHtml?: () => Promise<string>;
    onLocator?: (options: YieldLocator) => Promise<unknown>;
    onNavigate: (options: YieldNavigate & { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    onReload?: (options: { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    onScreenshot?: (options: YieldScreenshot) => Promise<void>;
    onYield?: (params: YieldParams) => Promise<void>;
}

export async function execute({ maxYields = 1000, ...options}: ExecuteOptions): Promise<ExtractResult> {
    let url = options.url || options.template.url;
    if (!url || typeof url !== "string")
        throw new Error("url not specified");

    url = encodeURI(evaluateFormula(`\`${url}\``, { params: options.template.params }) as string);
    const originalUrl = url;
    const { domain, origin } = parseUrl(url); // take domain and origin from the original url

    const timeout = typeof options.template.timeout === "number" ? options.template.timeout * 1000 : undefined;
    const waitUntil = options.template.waitUntil;
    
    let lastNavigationResult = await options.onNavigate({ url, timeout, waitUntil });
    let state = {
        params: {},
        vars: {},
        ...options.template,
        url,
        debug: options.debug || options.template.debug
    } as ExtractState;

    let i = 0;
    state = await options.onExtract(state, script || (global as unknown as { script: string }).script);
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
                lastNavigationResult = await options.onNavigate({
                    ...state.yield.params.navigate,
                    timeout: state.yield.params.timeout || timeout,
                    waitUntil: state.yield.params.waitUntil || waitUntil
                });
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
            await options.onYield(state.yield.params);
        }

        state = await options.onExtract(state, script || (global as unknown as { script: string }).script);
    }

    let html = "";
    if (options.html && options.onHtml)
        html = await options.onHtml();

    return { 
        ...state,
        ok: state.errors.length === 0,
        status: lastNavigationResult.status,
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

export const script = "";
