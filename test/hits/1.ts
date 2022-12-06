import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <h1>Lorum</h1>
        <h1>Ipsum</h1>
        <h1>Dolor</h1>
        <h2>Qui</h2>
        <h2>Dolorem</h2>
        <h3>Platea</h3>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "p0",
                    "all": true,
                    "query": [
                        ["h1"],
                        ["h2"],
                        ["h3"]
                    ]
                },
                {
                    "name": "p1",
                    "hits": 1,
                    "all": true,
                    "query": [
                        ["h1"],
                        ["h2"],
                        ["h3"]
                    ]
                },
                {
                    "name": "p2",
                    "hits": 2,
                    "all": true,
                    "query": [
                        ["h1"],
                        ["h2"],
                        ["h3"]
                    ]
                },
                {
                    "name": "p3",
                    "hits": 3,
                    "all": true,
                    "query": [
                        ["h1"],
                        ["h2"],
                        ["h3"]
                    ]
                },
                {
                    "name": "pn",
                    "hits": null,
                    "all": true,
                    "query": [
                        ["h1"],
                        ["h2"],
                        ["h3"]
                    ]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("hits/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("p0 has expected value", () => expect(result.data.p0).to.equal("Lorum\nIpsum\nDolor\nQui\nDolorem\nPlatea"));
    it("p1 has expected value", () => expect(result.data.p1).to.equal("Lorum\nIpsum\nDolor"));
    it("p2 has expected value", () => expect(result.data.p2).to.equal("Lorum\nIpsum\nDolor\nQui\nDolorem"));
    it("p3 has expected value", () => expect(result.data.p3).to.equal("Lorum\nIpsum\nDolor\nQui\nDolorem\nPlatea"));
    it("pn has expected value", () => expect(result.data.pn).to.equal("Lorum\nIpsum\nDolor\nQui\nDolorem\nPlatea"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
