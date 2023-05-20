import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: "<p>A big nothing burger.</p>",
    actions: [
        {
            "select": [
                {
                    name: "a1",
                    type: "string",
                    repeated: true,
                    value: "{_value}"
                }
            ]
        }
    ] as syphonx.Action[],
    vars: { _value: ["1", "2"] }
};

describe("vars/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).eql(["1", "2"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
