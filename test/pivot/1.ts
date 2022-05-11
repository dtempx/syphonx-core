import { expect } from "chai";
import { syphonx, offline } from "../common/index.js";

const test = {
    url: "https://www.example.com/",
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
                    "$": [["h3"]],
                    "pivot": {
                        "$": [[".",["nextUntil","h3"]]],
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

describe("pivot/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("p1 has expected value", () => expect(result.data.p1).to.eql([
        { name: "abc", group: "111" },
        { name: "def", group: "111" },
        { name: "ghi", group: "111" },
        { name: "jkl", group: "222" },
        { name: "mno", group: "333" },
        { name: "pqr", group: "333" }
    ]));
});
