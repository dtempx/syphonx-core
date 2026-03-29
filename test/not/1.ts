// Tests the not transform operator with a regex pattern, verifying that elements matching
// the pattern are removed while non-matching elements are retained (inverse of filter).

import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <ul>
            <li>alpha</li>
            <li>beta</li>
            <li>gamma</li>
            <li>delta</li>
        </ul>
    `,
    actions: [
        {
            "transform": [
                { "query": ["li",["not","/ta$/"],["remove"]] }
            ]
        },
        {
            "select": [
                {
                    "repeated": true,
                    "query": [["li"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("not/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("data has expected value", () => expect(result.data).to.eql(["beta", "delta"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
