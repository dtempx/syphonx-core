import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <h3>Lorum:</h3>
        <p>Ipsum</p>
        <h3>:Consectetur</h3>
        <p>Sit amet</p>
    `,
    actions: [
        {
            "transform": [
                { "$": ["h3:contains(':')",["filter","{value.endsWith(':')}"],["replaceWith","{`<h2>${value.replace(':','').trim()}</h2>`}"]] }
            ]
        }
    ] as syphonx.Action[]
};

describe("transform/6", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("html has expected output", () => expect(result.html).to.contain(`<h2>Lorum</h2>`));
    it("html has expected output", () => expect(result.html).to.contain(`<h3>:Consectetur</h3>`));
});
