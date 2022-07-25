import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: "<div>red, orange, green, blue, indigo, violet</div>",
    actions: [
        {
            "select": [
                {
                    "name": "color1",
                    "$": [["div",["cut",",",0]]]
                },
                {
                    "name": "color2",
                    "$": [["div",["cut",",",1]]]
                },
                {
                    "name": "color3",
                    "$": [["div",["cut",",",-1]]]
                },
                {
                    "name": "color4",
                    "$": [["div",["cut",",",-2]]]
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
});
