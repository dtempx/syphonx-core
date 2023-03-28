import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: "https://news.ycombinator.com/",
    //debug: true,
    //show: true,
    actions: [
        {
            "repeat": {
                "limit": 2,
                "actions": [
                    {
                        "select": [
                            {
                                "name": "articles",
                                "type": "object",
                                "repeated": true,
                                "query": [[".titleline"]],
                                "select": [
                                    {
                                        "name": "title",
                                        "query": [["."]]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "snooze": [1]
                    },
                    {
                        "click": {
                            "query": [["a.morelink"]]
                        }
                    },
                    {
                        "yield": {
                            "params": {
                                "waitUntil": "domcontentloaded"
                            }
                        }
                    }
                ]
            }
        }
    ] as syphonx.Action[]
};

describe("online/7", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("has expected number of articles", () => expect(result.data.articles).to.have.lengthOf(60));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
