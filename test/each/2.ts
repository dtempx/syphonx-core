import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: new URL("content/dropdown.html", import.meta.url).toString(),
    //debug: true,
    //show: true,
    actions: [
        {
            "each": {
                "query": [["select > option"]],
                "actions": [
                    {
                        "click": {
                            "query": [["."]]
                        }
                    },
                    {
                        "select": [
                            {
                                "name": "a1",
                                "type": "string",
                                "repeated": true,
                                "context": null,
                                "query": [["#output"]]
                            }
                        ]
                    }
                ]
            }
        }
    ] as syphonx.Action[]
};

describe("each/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.eql(["first", "second", "third"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});

