import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <ul>
            <li>news</li>
            <li>weather</li>
            <li>sports</li>
        </ul>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "query": [["ul > li"]],
                    "format": "singleline"
                },
                {
                    "name": "a2",
                    "query": [["ul > li"]],
                    "format": "multiline"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("format/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.equal("news weather sports"));
    it("a2 has expected value", () => expect(result.data.a2).to.be.equal("news\nweather\nsports"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
