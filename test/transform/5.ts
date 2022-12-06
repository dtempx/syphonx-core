import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <h1>Joe</h1>
        <h2>Jane</h2>
    `,
    actions: [
        {
            "transform": [
                { "query": ["h1",["addClass","{value.toLowerCase()}"]] },
                { "query": ["h2",["attr","id","{value.toUpperCase()}"]] }
            ]
        }
    ] as syphonx.Action[]
};

describe("transform/5", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("html has expected output", () => expect(result.html).to.contain(`<h1 class="joe">Joe</h1>`));
    it("html has expected output", () => expect(result.html).to.contain(`<h2 id="JANE">Jane</h2>`));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
