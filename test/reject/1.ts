import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
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
                { "$": [["li",["reject","/ta$/"],["remove"]]] }
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

describe("reject/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("data has expected value", () => expect(result.data).to.eql(["beta", "delta"]));
});
