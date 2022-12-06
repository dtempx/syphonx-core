import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <h1>Lorum</h1>
        <p>Ipsum</p>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "p1",
                    "all": true,
                    "query": [
                        ["p:contains('Ipsum')"],
                        ["h1 ~ p"]
                    ]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("general/4", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("p1 has expected value", () => expect(result.data.p1).to.equal("Ipsum"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
