import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `<div>hello</div>`,
    actions: [
        {
            "select": [
                {
                    "name": "t1",
                    "$": [["div"]]
                },
                {
                    "name": "t2",
                    "$": [["h1"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("general/3", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("t1 has expected value", () => expect(result.data.t1).to.equal("hello"));
    it("t2 has expected value", () => expect(result.data.t2).to.be.null);
});
