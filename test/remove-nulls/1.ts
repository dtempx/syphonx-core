// Tests the removeNulls option on repeated attr:href queries: default behaviour preserves
// nulls, removeNulls:true strips them, and removeNulls:false explicitly retains them.

import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <div>
            <a href="1">one</a>
            <a>two</a>
            <a href="3">three</a>
        </div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "query": [["a",["attr","href"]]],
                    "repeated": true
                },
                {
                    "name": "a2",
                    "query": [["a",["attr","href"]]],
                    "repeated": true,
                    "removeNulls": true
                },
                {
                    "name": "a3",
                    "query": [["a",["attr","href"]]],
                    "repeated": true,
                    "removeNulls": false
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("remove-nulls/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).eql(["https://www.example.com/1", null, "https://www.example.com/3"]));
    it("a2 has expected value", () => expect(result.data.a2).eql(["https://www.example.com/1", "https://www.example.com/3"]));
    it("a3 has expected value", () => expect(result.data.a3).eql(["https://www.example.com/1", null, "https://www.example.com/3"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
