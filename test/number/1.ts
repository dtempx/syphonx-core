import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div id="a1">123.45</div>
        <div id="a2">Price $9.99</div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "type": "number",
                    "$": [["#a1"]]
                },
                {
                    "name": "a2",
                    "type": "number",
                    "$": [["#a2"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("number/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.eql(123.45));
    it("a2 has expected value", () => expect(result.data.a2).to.be.eql(9.99));
});
