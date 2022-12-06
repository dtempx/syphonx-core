import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <ul>
            <li>abc</li>
            <li>def</li>
            <li>ghi</li>
        </ul>
    `,
    actions: [
        {
            "transform": [
                { "query": ["li",["replaceText","{value.toUpperCase()}"]] }
            ]
        }
    ] as syphonx.Action[]
};

describe("transform/3", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("html has expected output", () => expect(result.html.replace(/\s*/g, "")).to.contain(`<ul><li>ABC</li><li>DEF</li><li>GHI</li></ul>`));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
