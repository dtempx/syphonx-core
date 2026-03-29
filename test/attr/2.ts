// Tests that format automatically defaults to "href" when a query uses attr:href or attr:src,
// and that an explicit format override (e.g. format:"none") takes precedence over the default.

import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <div>
            <a href="foo">bar</a>
            <img src="/baz">
        </div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "query": [["a",["attr","href"]]]
                },
                {
                    "name": "i1",
                    "query": [["img",["attr","src"]]]
                },
                {
                    "name": "a2",
                    "query": [["a",["attr","href"]]],
                    "format": "href"
                },
                {
                    "name": "a3",
                    "query": [["a",["attr","href"]]],
                    "format": "none"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("attr/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("attr:href defaults format to href", () => expect(result.data.a1).to.be.equal("https://www.example.com/foo"));
    it("attr:src defaults format to href", () => expect(result.data.i1).to.be.equal("https://www.example.com/baz"));
    it("explicit format:href still resolves", () => expect(result.data.a2).to.be.equal("https://www.example.com/foo"));
    it("explicit format:none returns raw value", () => expect(result.data.a3).to.be.equal("foo"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
