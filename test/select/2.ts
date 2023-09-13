import { expect } from "chai";
import { syphonx, select } from "../common.js";

const test = {
    selects: [
        {
            "name": "a1",
            "query": [["li"]],
            "repeated": true
        }
    ] as syphonx.Select[],
    html: `
<div id="1">
    <ul>
        <li>abc</lib>
        <li>def</lib>
    </ul>
</div>
<div id="2">
    <ul>
        <li>ghi</lib>
        <li>jkl</lib>
    </ul>
</div>
    `
};

describe("select/2", () => {
    describe("without outer context", () => {
        let result: syphonx.ExtractState;
        before(() => result = select(test.selects, test.html));
        it("a1 has expected value", () => expect(result.data.a1).eql(["abc", "def", "ghi", "jkl"]));
        it("no errors", () => expect(result.errors).to.be.empty);
    });
    
    describe("with outer context", () => {
        let result: syphonx.ExtractState;
        before(() => result = select(test.selects, test.html, { context: "#2"}));
        it("a1 has expected value", () => expect(result.data.a1).eql(["ghi", "jkl"]));
        it("no errors", () => expect(result.errors).to.be.empty);
    });    
});
