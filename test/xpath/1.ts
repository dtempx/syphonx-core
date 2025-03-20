import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: "https://www.example.com/",
    actions: [
        {
            "select": [
                {
                    "name": "h1",
                    "query": [["xpath://h1"]]
                },
                {
                    "name": "href",
                    "query": [["xpath://a/@href"]]
                },
                {
                    "name": "domain",
                    "query": [["xpath://a/@href", ["extract","/^https://www.([^/]+)//"]]]
                },
                {
                    "name": "meta_content",
                    "query": [["xpath://meta/@content"]],
                    "repeated": true
                },
                {
                    "name": "string_result",
                    "query": [["xpath:string(/html/head/title)"]]
                },
                {
                    "name": "number_result",
                    "query": [["xpath:count(//meta)"]]
                },
                {
                    "name": "boolean_result",
                    "query": [["xpath:count(//p) > 0"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("xpath/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("result.url has expected value", () => expect(result.url).to.be.equal("https://www.example.com/"));
    it("result.domain has expected value", () => expect(result.domain).to.be.equal("example.com"));
    it("result.data.h1 has expected value", () => expect(result.data.h1).to.be.equal("Example Domain"));
    it("result.data.href has expected value", () => expect(result.data.href).to.be.equal("https://www.iana.org/domains/example"));
    it("result.data.domain has expected value", () => expect(result.data.domain).to.be.equal("iana.org"));
    it("result.data.meta_content has expected value", () => expect(result.data.meta_content).to.be.an("array").that.has.lengthOf(2).and.contains("text/html; charset=utf-8").and.contains("width=device-width, initial-scale=1"));
    it("result.data.string_result has expected value", () => expect(result.data.string_result).to.be.equal("Example Domain"));
    it("result.data.number_result has expected value", () => expect(result.data.number_result).to.be.equal(3));
    it("result.data.boolean_result has expected value", () => expect(result.data.boolean_result).to.be.true);
    it("result.online is true", () => expect(result.online).to.be.true);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
