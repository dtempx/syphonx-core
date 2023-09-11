import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div>one | two | three</div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "query": [["div",["extractAll","/([^|]+)/"]]]
                },
                {
                    "name": "a2",
                    "query": [["div",["extractAll","/([^|]+)/",","]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("extract/3", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).equals("one\ntwo\nthree"));
    it("a2 has expected value", () => expect(result.data.a2).equals("one , two , three"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
