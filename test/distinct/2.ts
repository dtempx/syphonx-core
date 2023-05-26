import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    unwrap: false,
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
    ] as syphonx.Action[],
};

describe("distinct/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).eql({
        key: "a1",
        value: [
            "alpha",
            "beta",
            "gamma",
            "alpha",
            "delta"
        ],
        nodes: [
            "body > ul > li:nth-child(1)",
            "body > ul > li:nth-child(2)",
            "body > ul > li:nth-child(3)",
            "body > ul > li:nth-child(4)",
            "body > ul > li:nth-child(5)"
        ]
    }));
    it("a2 has expected value", () => expect(result.data.a2).eql({
        key: "a2",
        value: [
            "alpha",
            "beta",
            "gamma",
            "delta"
        ],
        nodes: [
            "body > ul > li:nth-child(1)",
            "body > ul > li:nth-child(2)",
            "body > ul > li:nth-child(3)",
            "body > ul > li:nth-child(5)"
        ]
    }));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
