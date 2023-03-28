import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: "https://www.example.com/",
    //debug: true,
    //show: true,
    actions: [
        { "select": [
            {
                "name": "title1",
                "query": [["title"]]
            },
            {
                "name": "url1",
                "value": "{url}"
            },
            {
                "name": "domain1",
                "value": "{domain}"
            },
            {
                "name": "origin1",
                "value": "{origin}"
            }
        ] },
        { "click": { "query": [["a"]] }},
        { "yield": null },
        { "select": [
            {
                "name": "title2",
                "query": [["title"]]
            },
            {
                "name": "url2",
                "value": "{url}"
            },
            {
                "name": "domain2",
                "value": "{domain}"
            },
            {
                "name": "origin2",
                "value": "{origin}"
            }
        ] }
    ] as syphonx.Action[]
};

describe("online/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("result.data.title1 has expected value", () => expect(result.data.title1).to.be.equal("Example Domain"));
    it("result.data.title2 has expected value", () => expect(result.data.title2).to.be.equal("IANA-managed Reserved Domains"));
    it("result.data.url1 has expected value", () => expect(result.data.url1).to.be.equal("https://www.example.com/"));
    it("result.data.url2 has expected value", () => expect(result.data.url2).to.be.equal("https://www.iana.org/domains/reserved"));
    it("result.data.domain1 has expected value", () => expect(result.data.domain1).to.be.equal("example.com"));
    it("result.data.domain2 has expected value", () => expect(result.data.domain2).to.be.equal("iana.org"));
    it("result.data.origin1 has expected value", () => expect(result.data.origin1).to.be.equal("https://www.example.com"));
    it("result.data.origin2 has expected value", () => expect(result.data.origin2).to.be.equal("https://www.iana.org"));
    it("result.url has expected value", () => expect(result.url).to.be.equal("https://www.example.com/"));
    it("result.domain has expected value", () => expect(result.domain).to.be.equal("example.com"));
    it("result.origin has expected value", () => expect(result.origin).to.be.equal("https://www.example.com"));
    it("result.online is true", () => expect(result.online).to.be.true);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
