import * as syphonx from "../index.js";
import playwright, { Browser } from "playwright";
import { ExtractState } from "../index.js";
import { args, headers, userAgent, viewport } from "./defaults.js";
import { host, invokeAsyncMethod } from "../host.js";

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

        const result = await host({
            url,
            unwrap,
            extractHtml: options.html,
            //retries: 2,
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
            onGoback: async ({ timeout, waitUntil }) => {
                const response = await page.goBack({ timeout, waitUntil });
                const status = response?.status();
                return { status };
            },
            onHtml: async () => {
                const html = await page.evaluate(() => document.querySelector("*")!.outerHTML);
                return html;
            },
            onLocator: async ({ frame, selector, method, params }) => {
                let locator = undefined as playwright.Locator | undefined;
                if (frame)
                    locator = await page.frameLocator(frame).locator(selector);
                else
                    locator = await page.locator(selector);
                const result = await invokeAsyncMethod(locator, method, params);
                return result;
            },
            onNavigate: async ({ url, timeout, waitUntil }) => {
                const response = await page.goto(url, { timeout, waitUntil });
                const status = response?.status();
                return { status };
            },
            onReload: async ({ timeout, waitUntil }) => {
                const response = await page.reload({ timeout, waitUntil });
                const status = response?.status();
                return { status };
            },
            onScreenshot: async ({ selector, fullPage, ...options }) => {
                const path = `./screenshots/${new Date().toLocaleString("en-US", { hour12: false }).replace(/:/g, "-").replace(/\//g, "-").replace(/,/g, "")}.png`;
                let clip: { x: number, y: number, height: number, width: number } | undefined = undefined;
                if (selector)
                    clip = await page.evaluate(() => document.querySelector(selector)?.getBoundingClientRect());
                await page.screenshot({ ...options, path, clip, fullPage });
            },
            onYield: async ({ timeout, waitUntil }) => {
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
