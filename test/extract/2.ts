import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `<div>xyz</div>`,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "$": [["div",["extract"]]]
                },
                {
                    "name": "a2",
                    "$": [["div",["extract", 0]]]
                },
                {
                    "name": "a3",
                    "$": [["div",["extract", "/, ([a-z]+),/", "???"]]]
                },
                {
                    "name": "a4",
                    "$": [["div",["extract", "???"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("extract/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("not ok", () => expect(result.ok).to.be.false);
    it("errors is of expected length", () => expect(result.errors).to.have.lengthOf(4));
    it("a1 has expected value", () => expect(result.data.a1).to.equal("xyz"));
    it("a1 has expected error", () => expect(result.errors).to.include.deep.members([{
        code: "invalid-operand",
        key: undefined,
        message: `Operand #1 of "extract" is invalid: "undefined" is not a string`
    }]));
    it("a2 has expected value", () => expect(result.data.a1).to.equal("xyz"));
    it("a2 has expected error", () => expect(result.errors).to.include.deep.members([{
        code: "invalid-operand",
        key: undefined,
        message: `Operand #1 of "extract" is invalid: "0" is not a string`
    }]));
    it("a3 has expected value", () => expect(result.data.a3).to.equal("xyz"));
    it("a3 has expected error", () => expect(result.errors).to.include.deep.members([{
        code: "invalid-operand",
        key: undefined,
        message: `Operand #2 of "extract" is invalid: "???" is not a boolean`
    }]));
    it("a4 has expected value", () => expect(result.data.a4).to.equal("xyz"));
    it("a4 has expected error", () => expect(result.errors).to.include.deep.members([{
        code: "invalid-operand",
        key: undefined,
        message: `Invalid regular expression for "extract"`
    }]));
});
