import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: "<h1>xyz</h1><p>abc</p>",
    actions: [
        {
            "select": [
                {
                    "name": "_h1",
                    "query": [["h1"]]
                }
            ]
        },
        {
            "error": {
                "when": "{_h1 === 'xyz'}",
                "message": "{`${_h1} error`}",
                "level": 0
            }
        },
        {
            "select": [
                {
                    "name": "_p",
                    "query": [["p"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("custom-error/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("not ok", () => expect(result.ok).to.be.false);
    it("errors is of expected length", () => expect(result.errors).to.have.lengthOf(1));
    it("errors has expected value", () => expect(result.errors).to.eql([{
        code: "custom-error",
        key: "",
        message: "xyz error",
        level: 0,
        stack: undefined
    }]));
    it("_h1 has expected value", () => expect(result.vars._h1).to.equal("xyz"));
    it("_p has expected value", () => expect(result.vars._p).to.be.undefined);
});
