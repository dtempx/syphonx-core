import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <p>
            AAA
            BBB
            CCC
        </p>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "singleline",
                    "$": [["p"]],
                    "format": "singleline"
                },
                {
                    "name": "multiline",
                    "$": [["p"]],
                    "format": "multiline"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("format/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("singleline has expected value", () => expect(result.data.singleline).to.be.equal("AAA BBB CCC"));
    it("multiline has expected value", () => expect(result.data.multiline).to.be.equal("AAA\nBBB\nCCC"));
});
