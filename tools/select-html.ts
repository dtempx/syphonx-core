import playwright from "playwright";
import { parseArgs } from "../common/index.js";

const args = parseArgs({
    required: {
        url: "URL to navigate to"
    },
    optional: {
        selector: "CSS selector to output",
        show: "shows browser window"
    }
});

const url = args.url;
const selector = args.selector || "*";
const headless = !args.show;

const browser = await playwright.chromium.launch({ headless });
const page = await browser.newPage();

try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    if (!response?.ok)
        console.warn(`status: ${response?.statusText}`);
    const html = await page.evaluate(selector => Array.from(document.querySelectorAll(selector)).map(element => element.outerHTML), selector);
    console.log(html.join("\n\n"));
}
catch (err) {
    console.error(err instanceof Error ? err.message : JSON.stringify(err));
}

await page.close();
await browser.close();
