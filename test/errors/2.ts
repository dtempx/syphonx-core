import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div>Lorum:</div>
        <div>Ipsum</div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "$": [["div",["filter","{xyz.endsWith(':')}"]]]
                    
                },
                {
                    "name": "a2",
                    "$": [["div",["filter","{value.endsWith(':')}"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("errors/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("not ok", () => expect(result.ok).to.be.false);
    it("errors is of expected length", () => expect(result.errors).to.have.lengthOf(2));
    it("a1 has expected value", () => expect(result.data.a1).to.be.null);    
    it("a2 has expected value", () => expect(result.data.a2).to.be.equal("Lorum:"));
    it("has expected errors", () => expect(result.errors).to.include.deep.members([
        {
            code: "eval-error",
            key: "a1",
            message: `Error evaluating formula "{xyz.endsWith(':')}": xyz is not defined`
        },
        {
            code: "eval-error",
            key: "a1",
            message: `Failed to resolve operation for "$("div").filter("{xyz.endsWith(':')}")": Error evaluating formula`
        }
    ]));
});
