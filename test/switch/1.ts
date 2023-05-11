import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <div>
            <h1>News</h1>
            <p>Lorum ipsum</p>
        </div>
    `,
    actions: [
        {
            "switch": [
                {
                    "query": [["h1:contains('News')"]],
                    "actions": [
                        {
                            "select": [
                                {
                                    "name": "content",
                                    "query": [["h1 ~ p"]]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("switch/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("content has expected value", () => expect(result.data.content).to.be.equal("Lorum ipsum"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});