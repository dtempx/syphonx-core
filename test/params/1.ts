import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <div>easy</div>
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
                    "value": "{data.a1} {params.p1}{params.p2}{params.p3}"
                },
            ]
        }
    ] as syphonx.Action[],
    params: {
        p1: "a",
        p2: "b",
        p3: "c"
    }
};

describe("params/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.equal("easy"));
    it("a2 has expected value", () => expect(result.data.a2).to.be.equal("easy abc"));
});
