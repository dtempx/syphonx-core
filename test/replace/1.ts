import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: "<div>red 123 GREEN 456 blue</div>",
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "$": [["div",["replace","/([0-9]+)/g","::"]]]
                },
                {
                    "name": "a2",
                    "$": [["div",["replace","/e/gi","_"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("replace/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.equal("red :: GREEN :: blue"));
    it("a2 has expected value", () => expect(result.data.a2).to.be.equal("r_d 123 GR__N 456 blu_"));
});
