import { expect } from "chai";
import { syphonx, offline } from "../common/index.js";

const test = {
    url: "https://www.example.com/",
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
                { "$": [["h3",["endsWith",":"],["addClass","alpha"]]] },
                { "$": [["a",["wrap","<div></div>"]]] },
                { "$": [["b",["addClass","omega"]]], "active": false }
            ]
        }
    ] as syphonx.Action[]
};

describe("transform/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline({ ...test, debug: true }));
    it("html has expected output", () => expect(result.html).to.contain(`<h3 class="alpha">Lorum:</h3>`));
    it("html has expected output", () => expect(result.html).to.contain(`<h3>Credat</h3>`));
    it("html has expected output", () => expect(result.html).to.contain(`<h3 class="alpha">Ipsum:</h3>`));
    it("html has expected output", () => expect(result.html).to.contain(`<h3>Judias</h3>`));
    it("html has expected output", () => expect(result.html).to.contain(`<div><a href="#">Vino</a></div>`));
    it("html has expected output", () => expect(result.html).to.contain(`<b>Veritas</b>`));
});
