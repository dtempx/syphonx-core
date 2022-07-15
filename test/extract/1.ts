import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <ul>
            <li>color: red</li>
            <li>color: green</li>
            <li>color: blue</li>
            <li>size: small</li>
            <li>size: medium</li>
            <li>size: large</li>
        </ul>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "colors",
                    "repeated": true,
                    "$": [["li",["extract","/color: ([a-z]+)/"]]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("extract/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("colors has expected value", () => expect(result.data.colors).to.eql(["red", "green", "blue"]));
});
