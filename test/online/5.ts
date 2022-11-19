import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: "https://www.example.com/",
    actions: [
        {
            "waitfor": {
                "$": [["h2"]],
                "required": true,
                "timeout": 1
            }
        }
    ] as syphonx.Action[]
};

describe("online/5", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("not ok", () => expect(result.ok).to.be.false);
    it("errors is of expected length", () => expect(result.errors).to.have.lengthOf(1));
    it("has expected errors", () => expect(result.errors[0].code).to.equal("waitfor-timeout"));
});
