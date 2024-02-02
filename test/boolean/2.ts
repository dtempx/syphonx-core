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
            "select": [
                {
                    "name": "a1",
                    "type": "boolean",
                    "query": [["li", ["filter", "/ta$/"]]]
                },
                {
                    "name": "a1n",
                    "type": "boolean",
                    "negate": true,
                    "query": [["li", ["filter", "/ta$/"]]]
                },
                {
                    "name": "a2",
                    "type": "boolean",
                    "query": [["li", ["filter", "/ta$/"]]]
                },
                {
                    "name": "a2n",
                    "type": "boolean",
                    "negate": true,
                    "query": [["li", ["filter", "/ta$/"]]]
                },
                {
                    "name": "a3",
                    "type": "boolean",
                    "query": [["li", ["filter", "/xx$/"]]]
                },
                {
                    "name": "a3n",
                    "type": "boolean",
                    "negate": true,
                    "query": [["li", ["filter", "/xx$/"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("boolean/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.true);
    it("a1n has expected value", () => expect(result.data.a1n).to.be.false);
    it("a2 has expected value", () => expect(result.data.a2).to.be.true);
    it("a2n has expected value", () => expect(result.data.a2n).to.be.false);
    it("a3 has expected value", () => expect(result.data.a3).to.be.false);
    it("a3n has expected value", () => expect(result.data.a3n).to.be.true);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
