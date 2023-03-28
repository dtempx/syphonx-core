import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: new URL("content/1.html", import.meta.url).toString(),
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
                                "name": "titles",
                                "type": "string",
                                "repeated": true,
                                "query": [["h1"]]
                            }
                        ]
                    },
                    {
                        "snooze": [0.25]
                    },
                    {
                        "break": {
                            "query": [["#next"]],
                            "on": "none"
                        }
                    },
                    {
                        "click": {
                            "query": [["#next"]]
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

describe("repeat/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("has expected number of articles", () => expect(result.data.titles).to.eql(["First", "Second"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});