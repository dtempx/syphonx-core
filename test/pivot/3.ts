/*
import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
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
                    "name": "p1",
                    "type": "object",
                    "repeated": true,
                    "$": [["ul > li"]],
                    "pivot": {
                        "$": [[".",["closest","section"],["find","{`div > p:eq(${ pivot.index })`}"]]],
                        "select": [
                            {
                                "name": "name",
                                "$": [["."]]
                            },
                            {
                                "name": "group",
                                "$": [[".."]]
                            }
                        ]
                    }

                }
            ]
        }
    ] as syphonx.Action[]
};

describe("pivot/3", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("p1 has expected value", () => expect(result.data.p1).to.eql([
        { name: "abc", group: "111" },
        { name: "def", group: "222" },
        { name: "ghi", group: "333" }
    ]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
*/