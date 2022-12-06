import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div><b>ABC</b></div>
        <div><i>DEF</i></div>
        <div><u>GHI</u></div>
    `,
    actions: [
        {
            "transform": [
                { "query": ["div",["html","inner"],["replaceWith","{`<p>${value.toLowerCase()}</p>`}"]] }
            ]
        }
    ] as syphonx.Action[]
};

describe("transform/4", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("html has expected output", () => expect(result.html.replace(/\s*/g, "")).to.contain(`<p><b>abc</b></p><p><i>def</i></p><p><u>ghi</u></p>`));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
