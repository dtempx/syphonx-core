import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: "<h1>xyz</h1><p>abc</p>",
    actions: [
        {
            "error": {
                "query": [["h1"]],
                "message": "h1 not found",
                "level": 2
            }
        },
        {
            "error": {
                "query": [["h2"]],
                "message": "h2 not found",
                "level": 2
            }
        }
    ] as syphonx.Action[]
};

describe("errors/5", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("not ok", () => expect(result.ok).to.be.false);
    it("errors is of expected length", () => expect(result.errors).to.have.lengthOf(1));
    it("errors has expected value", () => expect(result.errors).to.eql([{
        code: "app-error",
        key: "",
        message: "h2 not found",
        level: 2,
        stack: undefined
    }]));
});
