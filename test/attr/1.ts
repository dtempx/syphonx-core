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
                    "query": [["a"]]
                },
                {
                    "name": "a2",
                    "query": [["a",["attr","href"]]]
                },
                {
                    "name": "a3",
                    "query": [["a",["attr","href"]]],
                    "format": "href"
                },
                {
                    "name": "i1",
                    "query": [["img",["attr","src"]]]
                },
                {
                    "name": "i2",
                    "query": [["img",["attr","src"]]],
                    "format": "href"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("attr/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.equal("bar"));
    it("a2 has expected value", () => expect(result.data.a2).to.be.equal("foo"));
    it("a3 has expected value", () => expect(result.data.a3).to.be.equal("https://www.example.com/foo"));
    it("i1 has expected value", () => expect(result.data.i1).to.be.equal("/baz"));
    it("i2 has expected value", () => expect(result.data.i2).to.be.equal("https://www.example.com/baz"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
