import playwright, { Browser, BrowserContext, Page } from "playwright";
import * as syphonx from "../index.js";
import * as fs from "fs";
import { evaluateFormula, unwrap } from "./utilities.js";
import { args, headers, userAgent, viewport } from "./defaults.js";

const jquery = fs.readFileSync(new URL("../node_modules/jquery/dist/jquery.slim.min.js", import.meta.url), "utf8");

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
    includeDOMRefs?: boolean;
    outputHTML?: "pre" | "post";
}

export async function online({ show = false, includeDOMRefs = false, outputHTML = "pre", ...options }: OnlineOptions): Promise<syphonx.ExtractResult> {
    if (!options.url || typeof options.url !== "string")
        throw new Error("url not specified");
    if (!options.vars)
        options.vars = {};

    const originalUrl = encodeURI(evaluateFormula(`\`${options.url}\``, { params: options.params }) as string);
    let browser: Browser | undefined = undefined;
    let context: BrowserContext | undefined = undefined;
    let page: Page | undefined = undefined;
    try {
        browser = await playwright.chromium.launch({ headless: !show, args });
        context = await browser.newContext({ userAgent: options.useragent || userAgent });
        page = await context.newPage();
        await page.setExtraHTTPHeaders({ ...headers, ...options.headers });
        await page.setViewportSize({ ...viewport, ...options.viewport });

        let status = 0;
        await page.on("response", response => {
            if (response.url() === originalUrl) {
                status = response.status();
            }
        });

        const timeout = typeof options.timeout === "number" ? options.timeout * 1000 : undefined;
        const waitUntil = options.waitUntil;
        await page.goto(originalUrl, { timeout, waitUntil });
        if (waitUntil)
            await page.waitForURL(originalUrl, { timeout, waitUntil });

        options.vars.__status = status;
        await page.evaluate(jquery);

        let html = "";
        if (outputHTML === "pre")
            html = await page.evaluate(() => document.querySelector("*")!.outerHTML);

        const debug = options.debug || !!process.env.DEBUG;
        let { url, domain, origin, ...state } = await page.evaluate(syphonx.extract, { ...options as any, originalUrl, debug });
        while (state.yield) {
            if (state.yield.params?.waitUntil)
                await page.waitForLoadState(state.yield.params.waitUntil, { timeout: state.yield.params.timeout || timeout });
            await page.evaluate(jquery);
            state.yield === undefined;
            state.vars.__status = status;
            state.debug = debug;
            state = await page.evaluate(syphonx.extract, { ...state as any, originalUrl });
        }

        if (outputHTML === "post")
            html = await page.evaluate(() => document.querySelector("*")!.outerHTML);

        await page.close();

        if (process.env.DEBUG)
            console.log(state.log);

        return {
            ...state,
            ok: state.errors.length === 0,
            status,
            url,
            domain,
            origin,
            originalUrl,
            html,
            online: true,
            data: includeDOMRefs ? state.data : unwrap(state.data)
        };
    }
    finally {
        if (page)
            await page.close();
        if (browser)
            await browser.close();
    }
}
