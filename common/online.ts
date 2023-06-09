import * as syphonx from "../index.js";
import playwright, { Browser } from "playwright";
import { ExtractState, YieldParams } from "../index.js";
import { args, headers, userAgent, viewport } from "./defaults.js";
import { execute } from "../execute.js";

interface OnlineOptions {
    actions: syphonx.Action[];
    url: string;
    params?: Record<string, unknown>;
    vars?: Record<string, unknown>;
    show?: boolean;
    debug?: boolean;
    timeout?: number; // seconds
    useragent?: string;
    headers?: Record<string, string>;
    viewport?: { width: number, height: number };
    waitUntil?: syphonx.DocumentLoadState;
    unwrap?: boolean;
    html?: boolean;
}

export async function online({ url, show = false, unwrap = true, ...options }: OnlineOptions): Promise<syphonx.ExtractResult> {
    let browser: Browser | undefined = undefined;
    try {
        browser = await playwright.chromium.launch({ headless: !show, args });
        const context = await browser.newContext({ userAgent: options.useragent || userAgent });
        const page = await context.newPage();
        await page.setExtraHTTPHeaders({ ...headers, ...options.headers });
        await page.setViewportSize({ ...viewport, ...options.viewport });

        const result = await execute({
            url,
            unwrap,
            html: options.html,
            template: {
                actions: options.actions,
                params: options.params,
                vars: options.vars,
                debug: options.debug
            },
            onExtract: async (state: ExtractState, script: string) => {
                const fn = new Function("state", `return ${script}(state)`);
                const result = await page.evaluate<ExtractState, ExtractState>(fn as any, state);
                return result;
            },
            onGoback: async () => {
                await page.goBack();
            },
            onHtml: async () => {
                const html = await page.evaluate(() => document.querySelector("*")!.outerHTML);
                return html;
            },
            onLocator: async (locators: syphonx.YieldLocator[]) => {
                const result: Record<string, unknown> = {};
                for (const { name, selector, frame, method, params } of locators) {
                    let locator = undefined as playwright.Locator | undefined;
                    if (frame)
                        locator = await page.frameLocator(frame).locator(selector);
                    else
                        locator = await page.locator(selector);
                    result[name] = await invokeAsyncMethod(locator, method, params);
                }
                return result;

                async function invokeAsyncMethod(obj: {}, method: string, args: unknown[] = []): Promise<unknown> {
                    const fn = (obj as Record<string, (...args: unknown[]) => unknown>)[method];
                    if (typeof fn === "function") {
                        const result = await fn(...args);
                        return result;
                    }
                }
            },
            onNavigate: async ({ url, timeout, waitUntil }: syphonx.YieldNavigate & { timeout?: number, waitUntil?: syphonx.DocumentLoadState }) => {
                let status = 0;
                const listener = (response: playwright.Response) => {
                    if (response.url() === url)
                        status = response.status();
                };
                await page.on("response", listener);
                await page.goto(url, { timeout, waitUntil });
                if (waitUntil)
                    await page!.waitForURL(url, { timeout, waitUntil });
                await page.off("response", listener);
                return { status };
            },
            onReload: async () => {
                await page.reload();
            },
            onScreenshot: async (selector?: string) => {
    
            },
            onYield: async (params: YieldParams) => {
                const { waitUntil, timeout } = params;
                await page.waitForLoadState(waitUntil, { timeout });
            }
        });
        return result;
    }
    finally {
        if (browser)
            await browser.close();
    }
}
