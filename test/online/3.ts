import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: "https://infinite-scroll.com/demo/masonry",
    actions: [
        {
            "repeat": {
                "limit": 8,
                "actions": [
                    {
                        "transform": [
                            { "$": ["{window}",["scrollBottom"]] }
                        ]
                    },
                    {
                        "waitfor": {
                            "select": [
                                {
                                    "name": "_last",
                                    "type": "boolean",
                                    "$": [[".infinite-scroll-last",["attr","style"],["filter","/display: block;/"]]]
                                }
                            ],
                            "timeout": 5
                        }
                    },
                    {
                        "break": {
                            "when": "{_last}"
                        }
                    }
                ]
            }
        },
        {
            "select": [
                {
                    "name": "images",
                    "type": "string",
                    "repeated": true,
                    "$": [["img",["attr","src"]]]
                }
                
            ]
        }
    ] as syphonx.Action[]
};

describe("online/3", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("has expected number of images", () => expect(result.data.images).to.have.lengthOf(92));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
