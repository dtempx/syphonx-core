import { expect } from "chai";
import { syphonx, online } from "../common.js";
import * as fs from "fs";

const html = fs.readFileSync(new URL("2.html", import.meta.url), "utf8");
const test = {
    url: `data:text/html,${encodeURIComponent(html.trim())}`,
    //show: true,
    //debug: true,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "waitfor": true,
                    "query": [["#a1"]]
                },
                {
                    "name": "a2",
                    "waitfor": true,
                    "query": [["#a2"]]
                },
                {
                    "name": "a3",
                    "waitfor": true,
                    "query": [["#a3"]]
                }
            ]
        },
    ] as syphonx.Action[]
};

describe("html/2a", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("result.data has expected value", () => expect(result.data).eql({ a1: "A1", a2: "A2", a3: "A3"}));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});

describe("html/2b", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online({
        ...test,
        timeout: 3 // not enough time to get A3 which appears in 10 seconds
    }));
    it("result.data has expected value", () => expect(result.data).eql({ a1: "A1", a2: "A2", a3: null }));
    it("ok is false", () => expect(result.ok).to.be.false);
    it("a3 has expected error", () => expect(result.errors.map((error: any) => ({ ...error, message: "redacted" }))).to.include.deep.members([{
        code: "waitfor-timeout",
        key: "a3",
        level: 1,
        message: "redacted",
        stack: undefined
    }]));
});
