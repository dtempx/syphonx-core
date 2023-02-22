import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: "https://www.ycombinator.com/",
    //debug: true,
    //show: true,
    actions: [
        {
            "select": [
                {
                    "name": "p1",
                    "query": [["{document}",["scrollTop"]]],
                    "type": "number"
                }
            ]
        },
        {
            "scroll": {
                "query": [[".startupLogos"]]
            }
        },
        {
            "select": [
                {
                    "name": "p2",
                    "query": [["{document}",["scrollTop"]]],
                    "type": "number"
                }
            ]
        },
        {
            "scroll": {
                "target": "bottom"
            }
        },
        {
            "select": [
                {
                    "name": "p3",
                    "query": [["{document}",["scrollTop"]]],
                    "type": "number"
                }
            ]
        },
        {
            "scroll": {
                "target": "top"
            }
        },
        {
            "select": [
                {
                    "name": "p4",
                    "query": [["{document}",["scrollTop"]]],
                    "type": "number"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("online/6", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("p1 has expected value", () => expect(result.data.p1).to.be.equal(0));
    it("p2 has expected value", () => expect(result.data.p2).to.be.greaterThan(0));
    it("p3 has expected value", () => expect(result.data.p3).to.be.greaterThan(result.data.p2));
    it("p4 has expected value", () => expect(result.data.p4).to.be.equal(0));
    it("result.online is true", () => expect(result.online).to.be.true);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
