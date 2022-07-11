import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <div>lorum</div>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "$": [["div"]]
                },
                {
                    "name": "a2",
                    "value": "ipsum"
                },
                {
                    "name": "a3",
                    "value": "{data.a1} {data.a2}"
                },
                {
                    "name": "a4",
                    "value": "{url}"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("value/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.equal("lorum"));
    it("a2 has expected value", () => expect(result.data.a2).to.be.equal("ipsum"));
    it("a3 has expected value", () => expect(result.data.a3).to.be.equal("lorum ipsum"));
    it("a4 has expected value", () => expect(result.data.a4).to.be.equal("https://www.example.com/"));
});
