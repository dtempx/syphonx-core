import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: "<div>xyz</div>",
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "$": [["div",["cut"]]]
                },
                {
                    "name": "a2",
                    "$": [["div",["cut", 0]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("cut/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("not ok", () => expect(result.ok).to.be.false);
    it("a1 has expected value", () => expect(result.data.a1).to.equal("xyz"));    
    it("a1 has expected error", () => expect(result.errors).to.include.deep.members([{ code: "invalid-operand", message: `Operand #1 of "cut" is invalid: "undefined" is not a string` }]));
    it("a2 has expected value", () => expect(result.data.a1).to.equal("xyz"));    
    it("a2 has expected error", () => expect(result.errors).to.include.deep.members([{ code: "invalid-operand", message: `Operand #1 of "cut" is invalid: "0" is not a string` }]));
});
