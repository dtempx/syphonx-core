import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <ul>
            <li>alpha</li>
            <li>beta</li>
            <li> </li>
        </ul>
    `,
    actions: [
        {
            "transform": [
                { "$": [["li",["nonblank"],["addClass","ok"]]] }
            ]
        },
        {
            "select": [
                {
                    "repeated": true,
                    "$": [["li.ok"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("blank/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("data has expected value", () => expect(result.data).to.eql(["alpha", "beta"]));
});
