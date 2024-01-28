import { expect } from "chai";
import * as cheerio from "cheerio";
import * as syphonx from "../../package/index.js";

const html = `
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
`;

const select: syphonx.Select[] = [
    {
        "name": "a1",
        "query": [["li"]],
        "repeated": true
    }
];

describe("sync-offline/2", () => {
    describe("without outer context", () => {
        let result: syphonx.ExtractState;
        before(async () => {
            const root = cheerio.load(html);
            result = syphonx.select(select, { root });
        });
        //before(() => result = select(test.selects, test.html));
        it("a1 has expected value", () => expect(result.data.a1.value).eql(["abc", "def", "ghi", "jkl"]));
        it("no errors", () => expect(result.errors).to.be.empty);
    });
    
    describe("with outer context", () => {
        let result: syphonx.ExtractState;
        before(async () => {
            const root = cheerio.load(html);
            result = syphonx.select(select, { root, context: "#2" });
        });    
        //before(() => result = select(test.selects, test.html, { context: "#2"}));
        it("a1 has expected value", () => expect(result.data.a1.value).eql(["ghi", "jkl"]));
        it("no errors", () => expect(result.errors).to.be.empty);
    });    
});
