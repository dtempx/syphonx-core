import { expect } from "chai";
import { syphonx, select } from "../common.js";

const test = {
    selects: [
        {
            "name": "a1",
            "query": [["a",["attr","href"]]]
        }
    ] as syphonx.Select[],
    html: `<a href="/xyz">abc</a>`
};

describe("select/1", () => {
    let result: syphonx.ExtractState;
    before(() => result = select(test.selects, test.html));
    it("a1 has expected value", () => expect(result.data.a1).to.be.equal("/xyz"));
    it("no errors", () => expect(result.errors).to.be.empty);
});
