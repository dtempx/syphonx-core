import { expect } from "chai";
import { syphonx, online } from "../common.js";

const test = {
    url: "https://www.harrisbeachmurtha.com/people/palermo-daniel-j/",
    //debug: true,
    //show: true,
    actions: [
        {
            "select": [{
                "name": "before",
                "query": [[".jet-accordion__item:has(.jet-toggle__label-text:contains('Insights')) .jet-listing-grid__item"]],
                "repeated": true
            }]
        },
        {
            "transform": [
                { "query": [".jet-accordion__item:has(.jet-toggle__label-text:contains('Insights')) .jet-listing-grid__item", ["autopaginate", ".jet-accordion__item:has(.jet-toggle__label-text:contains('Insights')) .jet-filters-pagination__link:contains('Next')", 3, 10]] }
            ]
        },
        {
            "select": [{
                "name": "after",
                "query": [[".jet-accordion__item:has(.jet-toggle__label-text:contains('Insights')) .jet-listing-grid__item"]],
                "repeated": true
            }]
        }
    ] as syphonx.Action[]
};

describe("online/8", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await online(test));
    it("before count has expected value", () => expect(result.data.before).to.be.an("array").with.lengthOf(8));
    it("after count has expected value", () => expect(result.data.after).to.be.an("array").with.lengthOf(24));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
