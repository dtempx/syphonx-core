import { expect } from "chai";
import { browser, script } from "../../common/index.js";
import { ExtractResult, Select } from "../../extract/index.js";

const url = "https://www.example.com";
const select: Select[] = [
    { "query": [["h1"]] }
];

describe("sync-online/1", () => {
    let result: ExtractResult;
    before(async () => {
        const page = await browser.open(url);
        const fn = new Function("obj", `return ${script}(obj)`);
        result = await page.evaluate(fn as any, { select });
        await browser.close(page);
    });
    it("result.url has expected value", () => expect(result.url).to.be.equal("https://www.example.com/"));
    it("result.domain has expected value", () => expect(result.domain).to.be.equal("example.com"));
    it("result.data has expected value", () => expect(result.data.value).to.be.equal("Example Domain"));
    it("no errors", () => expect(result.errors).to.be.empty);
});
