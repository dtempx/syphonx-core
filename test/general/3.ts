import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `<div>hello</div>`,
    actions: [
        {
            "select": [
                {
                    "name": "t1",
                    "query": [["div"]]
                },
                {
                    "name": "t2",
                    "query": [["h1"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("general/3", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("t1 has expected value", () => expect(result.data.t1).to.equal("hello"));
    it("t2 has expected value", () => expect(result.data.t2).to.be.null);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
