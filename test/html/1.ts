import { expect } from "chai";
import { syphonx, online } from "../common.js";
import * as fs from "fs";

const html = fs.readFileSync(new URL("1.html", import.meta.url), "utf8");
const test = {
    url: `data:text/html,${encodeURIComponent(html.trim())}`,
    //debug: true,
    actions: [
        {
            "select": [
                { "query": [["h1"]] }
            ]
        }
    ] as syphonx.Action[]
};

describe("html/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("result.url has expected value", () => expect(result.url).startsWith("data:text/html,"));
    it("result.domain has expected value", () => expect(result.domain).to.be.undefined);
    it("result.data has expected value", () => expect(result.data).to.be.equal("Hello"));
    it("result.online is true", () => expect(result.online).to.be.true);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
