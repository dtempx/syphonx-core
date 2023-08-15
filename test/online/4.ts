import { expect } from "chai";
import { syphonx, online } from "../common.js";

import chai from "chai";
import chaiString from "chai-string";
chai.use(chaiString);

const test = {
    url: "{`https://www.amazon.com/dp/${params.asin}/`}",
    params: {
        asin: "B081FGTPB7"
    },
    actions: [
        {
            "select": [
                { "query": [["#title"]] }
            ]
        }
    ] as syphonx.Action[]
};

describe("online/4", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("result.url has expected value", () => expect(result.url).to.startWith("https://www.amazon.com/dp/B081FGTPB7/"));
    it("result.data has expected value", () => expect(result.data).to.match(/Amazon Basics AA Alkaline/));
    it("result.online is true", () => expect(result.online).to.be.true);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
