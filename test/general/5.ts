import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <h1>abc</h1>
        <h1>def</h1>
        <h2>ghi</h2>
        <h2>jkl</h2>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "p1",
                    "all": false,
                    "$": [
                        ["h1"],
                        ["h2"]
                    ]
                },
                {
                    "name": "p2",
                    "all": true,
                    "$": [
                        ["h1"],
                        ["h2"]
                    ]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("general/5", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("p1 has expected value", () => expect(result.data.p1).to.equal("abc\ndef"));
    it("p2 has expected value", () => expect(result.data.p2).to.equal("abc\ndef\nghi\njkl"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
