import { expect } from "chai";
import { syphonx, offline } from "../common/index.js";

const test = {
    url: "https://www.example.com/",
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
                    "$": [["#d1"]]
                },
                {
                    "name": "d2",
                    "required": true,
                    "$": [["#d2"]]
                },
                {
                    "name": "d3",
                    "required": false,
                    "$": [["#d3"]]
                },
                {
                    "name": "d4",
                    "required": false,
                    "$": [["#d4"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("required/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("not ok", () => expect(result.ok).to.be.false);
    it("errors has expected value", () => expect(result.errors).to.eql([{ code: "select-required", message: "Required select 'd2' not found" }]));
});
