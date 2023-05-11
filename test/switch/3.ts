import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <div>
            <h1>Sports</h1>
            <i>Ipsum quia dolor</i>
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
                },
                {
                    "query": [["h1:contains('Weather')"]],
                    "actions": [
                        {
                            "select": [
                                {
                                    "name": "content",
                                    "query": [["h1 ~ b"]]
                                }
                            ]
                        }
                    ]
                },
                {
                    "actions": [
                        {
                            "select": [
                                {
                                    "name": "content",
                                    "query": [["h1 ~ i"]]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("switch/3", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("content has expected value", () => expect(result.data.content).to.be.equal("Ipsum quia dolor"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});