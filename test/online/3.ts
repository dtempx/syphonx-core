import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: "https://infinite-scroll.com/demo/masonry",
    //debug: true,
    //show: true,
    actions: [
        {
            "repeat": {
                "limit": 8,
                "actions": [
                    {
                        "select": [
                            {
                                "name": "_size",
                                "query": [["img.image-grid__image",["size"]]]
                            }
                        ]
                    },
                    {
                        "transform": [
                            { "query": ["{window}",["scrollBottom"]] }
                        ]
                    },
                    {
                        "waitfor": {
                            "select": [
                                {
                                    "name": "_more",
                                    "type": "boolean",
                                    "query": [["img.image-grid__image",["size"],["filter","{ value > _size }"]]]
                                }
                            ],
                            "timeout": 2
                        }
                    },
                    {
                        "break": {
                            "when": "{!_more}"
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
                    "query": [["img.image-grid__image",["attr","src"]]]
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
