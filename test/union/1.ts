import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <section>
            <div>
                <ul>
                    <li>111</li>
                    <li>222</li>
                    <li>333</li>
                </ul>
            </div>
            <div>
                <p>abc</p>
                <p>def</p>
                <p>ghi</p>
            </div>
        </section>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "type": "string",
                    "repeated": true,
                    "union": [
                        {
                            "query": [["div > p",["map","{`${value}-${union}`}"]]]
                        },
                        {
                            "query": [["ul > li",["map","{`${value}-${union}`}"]]]
                        }
                    ]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("union/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.eql(["abc-0","def-0","ghi-0","111-1","222-1","333-1"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});