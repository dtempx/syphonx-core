import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <h2>Lorum</h2>
        <h3>Ipsum</h3>
        <h4>Platea<h4>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "p1",
                    "hits": 1,
                    "all": true,
                    "$": [
                        ["h1"],
                        ["h2"],
                        ["h3"],
                        ["h4"]
                    ]
                },
                {
                    "name": "p2",
                    "hits": 2,
                    "all": true,
                    "$": [
                        ["h1"],
                        ["h2"],
                        ["h3"],
                        ["h4"]
                    ]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("hits/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("p1 has expected value", () => expect(result.data.p1).to.equal("Lorum"));
    it("p2 has expected value", () => expect(result.data.p2).to.equal("Lorum\nIpsum"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
