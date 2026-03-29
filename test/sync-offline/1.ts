// Tests the synchronous select() API directly with a cheerio root, verifying basic
// text extraction without going through the full extract() pipeline.

import { expect } from "chai";
import * as cheerio from "cheerio";
import * as syphonx from "../../package/index.js";

const html = `<h1>Example Domain</h1>`;
const select: syphonx.Select[] = [
    { query: [["h1"]] }
];

describe("sync-offline/1", () => {
    let result: syphonx.ExtractState;
    before(async () => {
        const root = cheerio.load(html);
        result = syphonx.select(select, { root });
    });
    it("result.data has expected value", () => expect(result.data.value).to.be.equal("Example Domain"));
    it("no errors", () => expect(result.errors).to.be.empty);
});
