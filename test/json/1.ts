import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `<script id="abc">{"xyz":123}</script>`,
    actions: [
        {
            "select": [
                {
                    "name": "xyz",
                    "query": [["#abc",["json", "{value.xyz}"]]]
                },
                {
                    "name": "obj",
                    "query": [["#abc",["json", "{value}"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("json/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("result 1 has expected value", () => expect(result.data.xyz).to.be.equal(123));
    it("result 2 has expected value", () => expect(result.data.obj).eql({ xyz: 123 }));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
