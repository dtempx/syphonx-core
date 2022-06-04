import { expect } from "chai";
import { syphonx, online } from "../common/index.js";

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
    it("result.errors is empty", () => expect(result.errors).to.be.empty);
});
