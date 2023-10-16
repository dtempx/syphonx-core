import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html:
`
<ul>
    <li>abc</li>
    <li>def</li>
    <li>ghi</li>
</ul>
`,
    actions: [
        {
            "select": [
                {
                    "name": "h1",
                    "query": [["ul",["html"]]]
                },
                {
                    "name": "h2",
                    "query": [["ul",["html","outer"]]]
                },
                {
                    "name": "h3",
                    "query": [["ul",["html","inner"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("html/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("h1 has expected value", () => expect(result.data.h1).to.be.equal("<ul>\n    <li>abc</li>\n    <li>def</li>\n    <li>ghi</li>\n</ul>"));
    it("h2 has expected value", () => expect(result.data.h2).to.be.equal(result.data.h1));
    it("h3 has expected value", () => expect(result.data.h3).to.be.equal("<li>abc</li>\n    <li>def</li>\n    <li>ghi</li>"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
