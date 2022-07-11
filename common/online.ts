import puppeteer from "puppeteer";
import * as syphonx from "../index.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { removeDOMRefs } from "./utilities.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __jquery = fs.readFileSync(path.resolve(__dirname, "../node_modules/jquery/dist/jquery.slim.min.js"), "utf8");

const defaultBrowserOptions = {
    useragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
    headers: { "Accept-Language": "en-US,en" },
    viewport: { width: 1366, height: 768 }
};

interface BrowserOptions {
    useragent?: string;
    headers?: Record<string, string>;
    viewport?: { width: number, height: number };
}

interface OnlineOptions {
    actions: syphonx.Action[];
    url: string;
    params?: Record<string, unknown>;
    show?: boolean;
    debug?: boolean;
    timeout?: number;
    browserOptions?: BrowserOptions;
    includeDOMRefs?: boolean;
    outputHTML?: "pre" | "post";
}

export async function online({ show = false, includeDOMRefs = false, outputHTML = "pre", browserOptions, timeout, ...options }: OnlineOptions): Promise<syphonx.ExtractResult> {
    if (!options.url)
        throw new Error("url not specified");

    let browser: puppeteer.Browser | undefined = undefined;
    let page: puppeteer.Page | undefined = undefined;
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
        const { useragent, headers, viewport } = { ...defaultBrowserOptions, ...browserOptions };
        await page.setUserAgent(useragent);
        await page.setExtraHTTPHeaders(headers);
        await page.setViewport(viewport);

        let status = 0;
        await page.on("response", response => {
            if (response.url() === options.url) {
                status = response.status();
            }
        });

        //await page.goto(url, { waitUntil: "networkidle0" });
        /*
        const jquery = await page.evaluate(async () => {
            const response = await window.fetch("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js");
            const result = await response.text();
            return result;
        });
        await page.goto(options.url);
        await page.evaluate(jquery);
        */

        // https://stackoverflow.com/questions/46987516/inject-jquery-into-puppeteer-page
        //await page.evaluate(__jquery);
        //await page.addScriptTag({ path: path.resolve(__dirname, "../node_modules/jquery/dist/jquery.slim.min.js") });
        //await page.addScriptTag({ url: "https://code.jquery.com/jquery-3.6.0.slim.min.js" });
        //await page.addScriptTag({ path: require.resolve("jquery") });

        await page.goto(options.url, { waitUntil: "load", timeout });
        await page.evaluate(__jquery);

        let html = "";
        if (outputHTML === "pre")
            html = await page.evaluate(() => document.querySelector("*")!.outerHTML);

        let { url, domain, origin, ...state } = await page.evaluate(syphonx.extract, options as any);
        while (state.yield) {
            await page.waitForNavigation({ waitUntil: "load", timeout: state.yield.timeout || timeout });
            state.yield === undefined;
            state = await page.evaluate(syphonx.extract, state as any);
        }

        if (outputHTML === "post")
            html = await page.evaluate(() => document.querySelector("*")!.outerHTML);

        return {
            ...state,
            ok: state.errors.length === 0,
            status,
            url,
            domain,
            origin,
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
