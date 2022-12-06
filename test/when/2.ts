import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div id="a1">lorum</div>
        <div id="a2">ipsum</div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "_ok",
                    "type": "boolean",
                    "query": [["#xyz"]]
                },
                {
                    "name": "a1",
                    "query": [["#a1"]],
                    "when": "{_ok}"
                },
                {
                    "name": "a2",
                    "query": [["#a2"]],
                    "when": "{!_ok}"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("when/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.null);
    it("a2 has expected value", () => expect(result.data.a2).to.be.equal("ipsum"));
    it("_ok in vars", () => expect(result.vars._ok).to.be.false);
    it("_ok not in data", () => expect(result.data._ok).to.be.undefined);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
