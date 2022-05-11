import puppeteer from "puppeteer";
import * as syphonx from "../../index.js";

export interface OnlineOptions {
    url: string;
    actions: syphonx.Action[];
    headless?: boolean;
}

export default async function ({ url, actions, headless = true }: OnlineOptions): Promise<syphonx.ExtractResult> {
    const browser = await puppeteer.launch({
        headless,
        args: [
            "--no-sandbox", // required to run within some containers
            "--disable-web-security", // enable accessing cross-domain iframe's
            "--disable-dev-shm-usage", // workaround for "Target closed" errors when capturing screenshots https://github.com/GoogleChrome/puppeteer/issues/1790
        ],
    });
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36");
    await page.setExtraHTTPHeaders({"Accept-Language": "en-US,en"});
    //await page.goto(url, { waitUntil: "networkidle0" });
    const jquery = await page.evaluate(async () => {
        const response = await window.fetch("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js");
        const result = await response.text();
        return result;
    });
    await page.goto(url);
    //await page.addScriptTag({ path: require.resolve("jquery") });
    await page.evaluate(jquery);

    const result = await page.evaluate(syphonx.extract, { url, actions } as any);

    await page.close();
    await browser.close();

    return result;
}
