import playwright, { Page } from "playwright";
import { args, headers, userAgent, viewport } from "./defaults.js";

export async function open(url: string, headless = true): Promise<Page> {
    const browser = await playwright.chromium.launch({ headless, args });
    const context = await browser.newContext({ userAgent });
    const page = await context.newPage();
    await page.setExtraHTTPHeaders(headers);
    await page.setViewportSize(viewport);
    await page.goto(url);
    return page;
}

export async function close(page: Page): Promise<void> {
    const browser = page.context().browser();
    await page.close();
    if (browser)
        await browser.close();
}

export async function html(url: string, headless = true): Promise<string> {
    const page = await open(url, headless);
    const html = await page.evaluate(() => document.querySelector("*")!.outerHTML);
    await close(page);
    return html;
}
