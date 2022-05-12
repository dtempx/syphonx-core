import { expect } from "chai";
import { syphonx, offline } from "../common/index.js";

const test = {
    url: "https://www.example.com/",
    html: `<div></div>`,
    actions: [
        {
            "select": [
                {
                    "name": "d1",
                    "type": "boolean",
                    "$": [["div",["is","div"]]]
                },
                {
                    "name": "d2",
                    "type": "boolean",
                    "$": [["div",["is","span"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("general/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("d1 has expected value", () => expect(result.data.d1).to.be.true);
    it("d2 has expected value", () => expect(result.data.d2).to.be.false);
});
