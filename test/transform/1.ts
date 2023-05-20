import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <h3>Lorum:</h3>
        <h3>Credat</h3>
        <h3>Ipsum:</h3>
        <h3>Judias</h3>
        <a href="#">Vino</a>
        <b>Veritas</b>
    `,
    actions: [
        {
            "transform": [
                { "query": ["h3",["map","{value?.endsWith(':') ? value :  undefined}"],["addClass","alpha"]] },
                { "query": ["h3",["map","{!value?.endsWith(':') ? value :  undefined}"],["replaceWith","{`<p>${value}</p>`}"]] },
                { "query": ["a",["wrap","<div></div>"]] },
                { "query": ["b",["addClass","omega"]] }
            ]
        }
    ] as syphonx.Action[]
};

describe("transform/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("html1 has expected output", () => expect(result.html.replace(/>\s*</g, "><")).to.contain(`<h3 class="alpha">Lorum:</h3><p>Credat</p>`));
    it("html2 has expected output", () => expect(result.html.replace(/>\s*</g, "><")).to.contain(`<h3 class="alpha">Ipsum:</h3><p>Judias</p>`));
    it("html3 has expected output", () => expect(result.html).to.contain(`<div><a href="#">Vino</a></div>`));
    it("html4 has expected output", () => expect(result.html).to.contain(`<b class="omega">Veritas</b>`));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
