import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: "<div>xyz</div>",
    actions: [
        {
            "select": [
                {
                    "$": [["div",["p:first"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("errors/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("not ok", () => expect(result.ok).to.be.false);
    it("errors is of expected length", () => expect(result.errors).to.have.lengthOf(1));
    it("errors has expected value", () => expect(result.errors).to.eql([{
        code: "invalid-operator",
        key: undefined,
        message: "Operator 'p:first' not found"
    }]));
});
