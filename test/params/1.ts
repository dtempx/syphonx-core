import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: "<div>easy</div>",
    params: {
        p1: "1",
        p2: "2",
        p3: "3"
    },
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "$": [["div"]]
                },
                {
                    "name": "a2",
                    "value": "{`${data.a1} as ${params.p1}${params.p2}${params.p3}`}"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("params/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.equal("easy"));
    it("a2 has expected value", () => expect(result.data.a2).to.be.equal("easy as 123"));
    it("params.p1 has expected value", () => expect(result.params.p1).to.be.equal("1"));
    it("params.p2 has expected value", () => expect(result.params.p2).to.be.equal("2"));
    it("params.p3 has expected value", () => expect(result.params.p3).to.be.equal("3"));
});
