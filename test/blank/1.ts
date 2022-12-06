import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
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
                { "query": ["li",["blank"],["remove"]] }
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

describe("blank/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("data has expected value", () => expect(result.data).to.eql(["alpha", "beta"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
