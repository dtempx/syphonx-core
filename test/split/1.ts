import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: "<div>red, green, blue</div>",
    actions: [
        {
            "select": [
                {
                    "repeated": true,
                    "query": [["div",["split",","]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("split/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("data has expected value", () => expect(result.data).eql(["red", "green", "blue"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
