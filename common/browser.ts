import puppeteer from "puppeteer";

export async function open(url: string, headless = true): Promise<puppeteer.Page> {
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
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en" });
    await page.setViewport({ width: 1366, height: 768 });

    //await page.goto(url, { waitUntil: "networkidle0" });
    await page.goto(url);

    return page;
}

export async function close(page: puppeteer.Page): Promise<void> {
    const browser = page.browser();
    await page.close();
    await browser.close();
}

export async function html(url: string, headless = true): Promise<string> {
    const page = await open(url, headless);
    const html = await page.evaluate(() => document.querySelector("*")!.outerHTML);
    await close(page);
    return html;
}
