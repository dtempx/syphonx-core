import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <a href="https://www.iana.org/domains/reserved">test1</a>
        <a href="/a">test2</a>
        <a href="b">test3</a>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "query": [["a:contains('test1')",["attr","href"]]],
                    "format": "href"
                },
                {
                    "name": "a2",
                    "query": [["a:contains('test2')",["attr","href"]]],
                    "format": "href"
                },
                {
                    "name": "a3",
                    "query": [["a:contains('test3')",["attr","href"]]],
                    "format": "href"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("format/href", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.equal("https://www.iana.org/domains/reserved"));
    it("a2 has expected value", () => expect(result.data.a2).to.be.equal("https://www.example.com/a"));
    it("a3 has expected value", () => expect(result.data.a3).to.be.equal("https://www.example.com/b"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
