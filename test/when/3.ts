import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <section>
            <div id="xyz"></div>
            <div id="a1">lorum</div>
            <div id="a2">ipsum</div>
        </section>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "obj",
                    "type": "object",
                    "$": [["section"]],
                    "select": [
                        {
                            "name": "_ok",
                            "type": "boolean",
                            "$": [["#xyz"]]
                        },
                        {
                            "name": "a1",
                            "$": [["#a1"]],
                            "when": "{_ok}"
                        },
                        {
                            "name": "a2",
                            "$": [["#a2"]],
                            "when": "{!_ok}"
                        }
                    ]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("when/3", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value in obj", () => expect(result.data.obj.a1).to.be.equal("lorum"));
    it("a2 has expected value in obj", () => expect(result.data.obj.a2).to.be.null);
    it("_ok in vars", () => expect(result.vars._ok).to.be.true);
    it("_ok not in obj", () => expect(result.data.obj._ok).to.be.undefined);
});
