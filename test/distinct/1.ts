import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <ul>
            <li>alpha</li>
            <li>beta</li>
            <li>gamma</li>
            <li>alpha</li>
            <li>delta</li>
        </ul>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "repeated": true,
                    "query": [["li"]]
                },
                {
                    "name": "a2",
                    "repeated": true,
                    "distinct": true,
                    "query": [["li"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("distinct/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).eql(["alpha", "beta", "gamma", "alpha", "delta"]));
    it("a2 has expected value", () => expect(result.data.a2).eql(["alpha", "beta", "gamma", "delta"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
