import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: "<h1>hello</h1>",
    actions: [
        {
            "select": [
                {
                    "query": [["h1"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("defaults/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("result has expected type", () => expect(result.data).to.be.a.string);
    it("result has expected value", () => expect(result.data).to.be.equal("hello"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
