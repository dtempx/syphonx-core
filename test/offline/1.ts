import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `<p>Hello</p>`,
    actions: [
        {
            "snooze": [60]
        },
        {
            "select": [
                {
                    "name": "p1",
                    "query": [["p"]]
                }
            ]
        }
    ] as syphonx.Action[],
    debug: true
};

describe("offline/1", () => {
    let result: syphonx.ExtractResult;
    let elapsed = 0;
    before(async () => {
        const t0 = Date.now();
        result = await offline(test);
        elapsed = Date.now() - t0;
    });
    it("p1 has expected value", () => expect(result.data.p1).to.be.equal("Hello"));
    it("elapsed has expected value", () => expect(elapsed).to.be.lessThan(100));
    it("log indicates snooze is skipped", () => expect(result.log).to.include("SNOOZE 60s SKIPPED"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
