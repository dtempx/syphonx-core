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
                { "$": ["li",["retain","/ta$/"],["remove"]] }
            ]
        },
        {
            "select": [
                {
                    "repeated": true,
                    "$": [["li"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("retain/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("data has expected value", () => expect(result.data).to.eql(["alpha", "gamma"]));
});
