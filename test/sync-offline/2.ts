import { expect } from "chai";
import * as cheerio from "cheerio";
import * as syphonx from "../../index.js";

const html = `<h1>Example Domain</h1>`;
const actions: syphonx.Action[] = [
    { transform: [{ "query": ["h1",["addClass","xyz"]] }] },
    { select: [{ query: [["h1.xyz"]] }]}
];

describe("sync-offline/2", () => {
    let result: syphonx.ExtractState;
    before(async () => {
        const root = cheerio.load(html);
        result = syphonx.extractSync({ actions, root });
    });
    it("result.data has expected value", () => expect(result.data.value).to.be.equal("Example Domain"));
    it("no errors", () => expect(result.errors).to.be.empty);
});
