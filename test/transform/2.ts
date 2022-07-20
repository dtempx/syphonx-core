import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <h1>1 2 3</h1>
        <h2>4 5 6</h2>
        <h3><b>lorum</b><b>ipsum</b></h3>
        <h4>ABC</h4>
        <h5>in vino veritas</h5>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "h1",
                    "$": [["h1"]]
                },
                {
                    "name": "h2",
                    "$": [["h2"]]
                }
            ]
        },
        {
            "transform": [
                { "$": [["h1",["replaceInnerText","{{ text.split(' ').reduce((sum, value) => sum + parseInt(value), 0) }}"]]] },
                { "$": [["h2",["replaceInnerHTML","{{ '<b>' + text.split(' ').reduce((sum, value) => sum + parseInt(value), 0) + '</b>' }}"]]] },
                { "$": [["h3",["replaceInnerText","{text}"]]] },
                { "$": [["h4",["replaceInnerText","{data.h1} {text} {data.h2}"]]] },
                { "$": [["h5",["replaceInnerHTML","{{ html.replace('vino', 'VINO') }}"]]] }
            ]
        }
    ] as syphonx.Action[]
};

describe("transform/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("html h1 has expected output", () => expect(result.html).to.contain(`<h1>6</h1>`));
    it("html h2 has expected output", () => expect(result.html).to.contain(`<h2><b>15</b></h2>`));
    it("html h3 has expected output", () => expect(result.html).to.contain(`<h3>lorum ipsum</h3>`));
    it("html h4 has expected output", () => expect(result.html).to.contain(`<h4>1 2 3 ABC 4 5 6</h4>`));
    it("html h5 has expected output", () => expect(result.html).to.contain(`<h5>in VINO veritas</h5>`));
});
