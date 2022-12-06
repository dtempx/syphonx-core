import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <div>
            <h3>111</h3>
            <p>abc</p>
            <p>def</p>
            <p>ghi</p>
            <h3>222</h3>
            <p>jkl</p>
            <h3>333</h3>
            <p>mno</p>
            <p>pqr</p>
        </div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "p1",
                    "type": "object",
                    "repeated": true,
                    "query": [["h3"]],
                    "pivot": {
                        "query": [[".",["nextUntil","h3"]]],
                        "collate": true,
                        "select": [
                            {
                                "name": "name",
                                "query": [["."]]
                            },
                            {
                                "name": "group",
                                "query": [[".."]]
                            }
                        ]
                    }

                }
            ]
        }
    ] as syphonx.Action[]
};

describe("pivot/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("p1 has expected value", () => expect(result.data.p1).to.eql([
        { name: "abc\ndef\nghi", group: "111" },
        { name: "jkl", group: "222" },
        { name: "mno\npqr", group: "333" }
    ]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
