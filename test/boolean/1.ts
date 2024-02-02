import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div id="a1">Lorum</div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "type": "boolean",
                    "query": [["#a1"]]
                },
                {
                    "name": "a1n",
                    "type": "boolean",
                    "negate": true,
                    "query": [["#a1"]]
                },
                {
                    "name": "a2",
                    "type": "boolean",
                    "query": [["#a2"]]
                },
                {
                    "name": "a2n",
                    "type": "boolean",
                    "negate": true,
                    "query": [["#a2"]]
                },
                {
                    "name": "a12",
                    "type": "boolean",
                    "query": [["#a1"], ["#a2"]]
                },
                {
                    "name": "a12n",
                    "type": "boolean",
                    "negate": true,
                    "query": [["#a1"], ["#a2"]]
                },
                {
                    "name": "a21",
                    "type": "boolean",
                    "query": [["#a2"], ["#a1"]]
                },
                {
                    "name": "a21n",
                    "type": "boolean",
                    "negate": true,
                    "query": [["#a2"], ["#a1"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("boolean/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.true);
    it("a1n has expected value", () => expect(result.data.a1n).to.be.false);
    it("a2 has expected value", () => expect(result.data.a2).to.be.false);
    it("a2n has expected value", () => expect(result.data.a2n).to.be.true);
    it("a12 has expected value", () => expect(result.data.a12).to.be.true);
    it("a12n has expected value", () => expect(result.data.a12n).to.be.false);
    it("a21 has expected value", () => expect(result.data.a21).to.be.true);
    it("a21n has expected value", () => expect(result.data.a21n).to.be.false);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
