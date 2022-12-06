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
                    "name": "a2",
                    "type": "boolean",
                    "query": [["#a2"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("boolean/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.true);
    it("a2 has expected value", () => expect(result.data.a2).to.be.false);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
