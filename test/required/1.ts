import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div id="d1">abc</div>
        <div id="d3">def</div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "d1",
                    "required": true,
                    "query": [["#d1"]]
                },
                {
                    "name": "d2",
                    "required": true,
                    "query": [["#d2"]]
                },
                {
                    "name": "d3",
                    "required": false,
                    "query": [["#d3"]]
                },
                {
                    "name": "d4",
                    "required": false,
                    "query": [["#d4"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("required/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("not ok", () => expect(result.ok).to.be.false);
    it("errors is of expected length", () => expect(result.errors).to.have.lengthOf(1));
    it("errors has expected value", () => expect(result.errors).to.eql([{
        code: "select-required",
        key: "d2",
        message: "Required select 'd2' not found",
        level: 0,
        stack: undefined
    }]));
});
