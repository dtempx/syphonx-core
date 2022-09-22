import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <ul>
            <li><a href="/1">first</a></li>
            <li><a href="/2">second</a></li>
            <li><a href="/3">third</a></li>
        </ul>
    `,
    actions: [
        {
            "select": [
                {
                    "repeated": true,
                    "$": [["ul > li"]],
                    "select": [
                        {
                            "name": "name",
                            "$": [["a"]]
                        },
                        {
                            "name": "href",
                            "format": "href",
                            "$": [["a",["attr","href"]]]
                        }
                    ]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("defaults/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("result has expected type", () => expect(result.data).to.be.an("array"));
    it("result has expected value", () => expect(result.data).to.eql([
        {
            "name": "first",
            "href": "https://www.example.com/1"
        },
        {
            "name": "second",
            "href": "https://www.example.com/2"
        },
        {
            "name": "third",
            "href": "https://www.example.com/3"
        }
    ]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
