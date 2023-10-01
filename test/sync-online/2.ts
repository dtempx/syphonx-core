import { expect } from "chai";
import { browser, script } from "../../common/index.js";
import { Transform } from "../../index.js";

const url = "https://www.example.com";
const transform: Transform[] = [
    { "query": ["h1",["addClass","xyz"]] }
];

describe("sync-online/2", () => {
    let html = "";
    before(async () => {
        const page = await browser.open(url);
        const fn = new Function("obj", `return ${script}(obj)`);
        await page.evaluate(fn as any, { transform });
        html = await browser.html(page);
        await browser.close(page);
    });
    it("html has expected value", () => expect(html).to.contain(`<h1 class="xyz">`));
});
