import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div>alpha</div>
        <div>beta</div>
        <div>delta</div>
        <h1>lorum</h1>
    `,
    actions: [
        {
            "select": [
                {
                    "repeated": true,
                    "query": [["h1",["prevAll"],["reverse"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("reverse/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("data has expected value", () => expect(result.data).to.eql(["alpha", "beta", "delta"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
