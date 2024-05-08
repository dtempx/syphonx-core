import { expect } from "chai";
import { syphonx, online } from "../common.js";
import * as fs from "fs";

// document.addEventListener('keydown', event => console.log('Key pressed:', event.key));
// 
// document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }))


const html = fs.readFileSync(new URL("keypress.html", import.meta.url), "utf8");
const test = {
    url: `data:text/html,${encodeURIComponent(html.trim())}`,
    //show: true,
    debug: true,
    actions: [
        {
            "keypress": {
                "key": "A"
            }
        },
        {
            "select": [
                {
                    "name": "keypress",
                    "query": [["#keypress"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("keypress/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("result.data has expected value", () => expect(result.data).eql({ keypress: "A" }));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
