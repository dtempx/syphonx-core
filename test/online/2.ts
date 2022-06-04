import { expect } from "chai";
import { syphonx, online } from "../common/index.js";

const test = {
    url: "https://www.example.com/",
    actions: [
        { "click": { "$": [["a"]] }},
        { "yield": null },
        { "select": [{ "$": [["title"]] }] }
    ] as syphonx.Action[]
};

describe("online/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("result.url has expected value"/*, () => expect(result.url).to.be.equal("https://www.iana.org/domains/reserved")*/);
    it("result.domain has expected value"/*, () => expect(result.domain).to.be.equal("iana.org")*/);
    it("result.data has expected value"/*, () => expect(result.data).to.be.equal("IANA-managed Reserved Domains")*/);
    it("result.online is true", () => expect(result.online).to.be.true);
    it("result.errors is empty", () => expect(result.errors).to.be.empty);
});
