import { expect } from "chai";
import { syphonx, online } from "../common.js";
import * as fs from "fs";

const html = fs.readFileSync(new URL("shadow.html", import.meta.url), "utf8");

const test = {
    url: `data:text/html,${encodeURIComponent(html.trim())}`,
    actions: [
        {
            "select": [
                {
                    "name": "h1",
                    "query": [["h1"]]
                },
                {
                    "name": "h2",
                    "query": [["custom-widget",["shadow"],["find","h2"]]] // find h2 within the shadow root
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("html/shadow", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("h1 has expected value", () => expect(result.data.h1).to.be.equal("Outside Shadow DOM"));
    it("h2 has expected value", () => expect(result.data.h2).to.be.equal("Inside Shadow DOM"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
