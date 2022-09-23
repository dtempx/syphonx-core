import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <ul>
            <li><a href="/1">first</a></li>
            <li><a href="/2">second</a></li>
            <li><a href="/3">third</a></li>
        </ul>
    `,
    actions: [{
        "select": [{ "$": [["ul > li",["size"]]] }]
    }] as syphonx.Action[]
};

describe("size/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("result has expected value", () => expect(result.data).to.equal(3));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
