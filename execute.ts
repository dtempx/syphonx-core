import { evaluateFormula, unwrap } from "./common/index.js";
import { parseUrl } from "./extract/lib/index.js";
import { Template } from "./template.js";

import {
    DocumentLoadState,
    ExtractResult,
    ExtractState,
    YieldLocator,
    YieldNavigate,
    YieldParams
} from "./extract/index.js";

export interface NavigateResult {
    status: number;
}

export interface ExecuteOptions {
    template: Template;
    url?: string;
    unwrap?: boolean;
    debug?: boolean;
    html?: boolean;
    onExtract: (state: ExtractState, script: string) => Promise<ExtractState>;
    onGoback: () => Promise<void>;
    onHtml: () => Promise<string>;
    onLocator?: (options: YieldLocator[]) => Promise<Record<string, unknown>>;
    onNavigate: (options: YieldNavigate & { timeout?: number, waitUntil?: DocumentLoadState }) => Promise<NavigateResult>;
    onReload: () => Promise<void>;
    onScreenshot?: (selector?: string) => Promise<void>;
    onYield: (params: YieldParams) => Promise<void>;
}

export async function execute(options: ExecuteOptions): Promise<ExtractResult> {
    if (!script)
        throw new Error("script not initialized");

    let url = options.url || options.template.url;
    if (!url || typeof url !== "string")
        throw new Error("url not specified");

    url = encodeURI(evaluateFormula(`\`${url}\``, { params: options.template.params }) as string);
    const originalUrl = url;
    const { domain, origin } = parseUrl(url); // take domain and origin from the original url

    const timeout = typeof options.template.timeout === "number" ? options.template.timeout * 1000 : undefined;
    const waitUntil = options.template.waitUntil;
    
    let navigation = await options.onNavigate({ url, timeout, waitUntil });
    let state = {
        params: {},
        vars: {},
        ...options.template,
        url,
        debug: options.debug || options.template.debug
    } as ExtractState;
    state = await options.onExtract(state, script);
    while (state.yield) {
        if (state.yield.params?.click) {
            await options.onYield({ waitUntil: state.yield.params.waitUntil });
        }
        else if (state.yield.params?.goback) {
            await options.onGoback();
        }
        else if (state.yield.params?.locators && options.onLocator) {
            await options.onLocator(state.yield.params.locators);
        }
        else if (state.yield.params?.navigate) {
            state.url = state.yield.params.navigate.url;
            navigation = await options.onNavigate({
                ...state.yield.params.navigate,
                timeout: state.yield.params.timeout || timeout,
                waitUntil: state.yield.params.waitUntil || waitUntil
            });
        }
        else if (state.yield.params?.reload && options.onReload) {
            await options.onReload();
        }
        else if (state.yield.params?.screenshot && options.onScreenshot) {
            await options.onScreenshot(state.yield.params.screenshot.selector);
        }
        else if (state.yield.params?.waitUntil) {
            await options.onYield(state.yield.params);
        }

        state = await options.onExtract(state, script);
    }

    let html = "";
    if (options.html && options.onHtml)
        html = await options.onHtml();

    return { 
        ...state,
        ok: state.errors.length === 0,
        status: navigation.status,
        html,
        originalUrl,
        domain,
        origin,
        data: options.unwrap ? unwrap(state.data) : state.data,
        online: true
    };
}

let script = "";

export function setScript(value: string): void {
    script = value;
}
