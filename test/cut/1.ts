import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: "<div>red, orange, green, blue, indigo, violet</div>",
    actions: [
        {
            "select": [
                {
                    "name": "color1",
                    "query": [["div",["cut",",",0]]]
                },
                {
                    "name": "color2",
                    "query": [["div",["cut",",",1]]]
                },
                {
                    "name": "color3",
                    "query": [["div",["cut",",",-1]]]
                },
                {
                    "name": "color4",
                    "query": [["div",["cut",",",-2]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("cut/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("color1 has expected value", () => expect(result.data.color1).to.be.equal("red"));
    it("color2 has expected value", () => expect(result.data.color2).to.be.equal("orange"));
    it("color3 has expected value", () => expect(result.data.color3).to.be.equal("violet"));
    it("color4 has expected value", () => expect(result.data.color4).to.be.equal("indigo"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
