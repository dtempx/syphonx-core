import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: "https://www.example.com/",
    actions: [
        {
            "select": [
                { "$": [["h1"]] }
            ]
        }
    ] as syphonx.Action[]
};

describe("online/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("result.url has expected value", () => expect(result.url).to.be.equal("https://www.example.com/"));
    it("result.domain has expected value", () => expect(result.domain).to.be.equal("example.com"));
    it("result.data has expected value", () => expect(result.data).to.be.equal("Example Domain"));
    it("result.online is true", () => expect(result.online).to.be.true);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
