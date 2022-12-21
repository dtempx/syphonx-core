import puppeteer, { Browser, Page, PuppeteerLifeCycleEvent } from "puppeteer";
import * as syphonx from "../index.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { evaluateFormula, removeDOMRefs } from "./utilities.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __jquery = fs.readFileSync(path.resolve(__dirname, "../node_modules/jquery/dist/jquery.slim.min.js"), "utf8");

const defaults = {
    useragent: "Mozilla/5.0 (X11; CrOS x86_64 15183.69.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    headers: { "Accept-Language": "en-US,en" },
    viewport: { width: 1366, height: 768 }
};

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
    waitUntil?: syphonx.DocumentLoadState | syphonx.DocumentLoadState[];
    includeDOMRefs?: boolean;
    outputHTML?: "pre" | "post";
}

function asPuppeteerLifeCycleEvent(state: syphonx.DocumentLoadState | syphonx.DocumentLoadState[] | undefined): PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[] | undefined {
    if (state instanceof Array)
        return state.map(value => asPuppeteerLifeCycleEvent(value) as PuppeteerLifeCycleEvent);
    else if (state === "load")
        return "load";
    else if (state === "domcontentloaded")
        return "domcontentloaded";
    else if (state === "networkidle")
        return "networkidle2";
    else if (state === "none")
        return undefined;
    else
        return "load";
}

export async function online({ show = false, includeDOMRefs = false, outputHTML = "pre", ...options }: OnlineOptions): Promise<syphonx.ExtractResult> {
    if (!options.url || typeof options.url !== "string")
        throw new Error("url not specified");
    if (!options.vars)
        options.vars = {};

    const originalUrl = evaluateFormula(`\`${options.url}\``, options.params) as string;
    let browser: Browser | undefined = undefined;
    let page: Page | undefined = undefined;
    try {
        browser = await puppeteer.launch({
            headless: !show,
            args: [
                "--no-sandbox", // required to run within some containers
                "--disable-web-security", // enable accessing cross-domain iframe's
                "--disable-dev-shm-usage", // workaround for "Target closed" errors when capturing screenshots https://github.com/GoogleChrome/puppeteer/issues/1790
            ],
        });

        page = await browser.newPage();
        await page.setUserAgent(options.useragent || defaults.useragent);
        await page.setExtraHTTPHeaders({ ...defaults.headers, ...options.headers });
        await page.setViewport(options.viewport || defaults.viewport);

        let status = 0;
        await page.on("response", response => {
            if (response.url() === originalUrl) {
                status = response.status();
            }
        });

        const timeout = typeof options.timeout === "number" ? options.timeout * 1000 : undefined;
        const waitUntil = asPuppeteerLifeCycleEvent(options.waitUntil);
        await page.goto(originalUrl, { timeout, waitUntil });
        options.vars._http_status = status;
        await page.evaluate(__jquery);

        let html = "";
        if (outputHTML === "pre")
            html = await page.evaluate(() => document.querySelector("*")!.outerHTML);

        const debug = options.debug || !!process.env.DEBUG;
        let { url, domain, origin, ...state } = await page.evaluate(syphonx.extract, { ...options as any, debug });
        while (state.yield) {
            await page.waitForNavigation({
                timeout: state.yield.timeout ? state.yield.timeout : timeout,
                waitUntil: state.yield.waitUntil ? asPuppeteerLifeCycleEvent(state.yield.waitUntil) : waitUntil
            });
            await page.evaluate(__jquery);
            state.yield === undefined;
            state.vars.__status = status;
            state.debug = debug;
            state = await page.evaluate(syphonx.extract, state as any);
        }

        if (outputHTML === "post")
            html = await page.evaluate(() => document.querySelector("*")!.outerHTML);

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
            data: includeDOMRefs ? state.data : removeDOMRefs(state.data)
        };
    }
    finally {
        if (page)
            await page.close();
        if (browser)
            await browser.close();
    }
}
