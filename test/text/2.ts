import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `<p><span>Mike</span> is a <span>specialist</span></p>`,
    actions: [
        {
            "select": [
                {
                    "name": "p1",
                    "$": [["p"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("text/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("p1 has expected value", () => expect(result.data.p1).to.be.equal("Mike is a specialist"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
