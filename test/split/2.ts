import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div>
            red
            green
            blue
        </div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a0",
                    "repeated": true,
                    "query": [["div",["split"]]]
                },
                {
                    "name": "a1",
                    "repeated": true,
                    "query": [["div",["split","\n"]]]
                },
                {
                    "name": "a2",
                    "repeated": true,
                    "query": [["div",["split","\n",2]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("split/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a0 has expected value", () => expect(result.data.a0).eql(["red", "green", "blue"]));
    it("a1 has expected value", () => expect(result.data.a1).eql(["red", "green", "blue"]));
    it("a2 has expected value", () => expect(result.data.a2).eql(["red", "green"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
