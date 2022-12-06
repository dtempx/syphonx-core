import { expect } from "chai";
import { syphonx, offline } from "../common.js";

describe("replace/2.1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline({
        html: "<span>hello</span>",
        actions: [
            {
                "transform": [
                    {
                        "query": ["span",["replaceTag","<div></div>"]]
                    }
                ]
            }
        ]
    }));
    it("html has expected output", () => expect(result.html).to.contain(`<div>hello</div>`));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});

describe("replace/2.2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline({
        html: "<span id='old' class='xyz' alt='greet'><a href='#'>hi</a></span>",
        actions: [
            {
                "transform": [
                    {
                        "query": ["span",["replaceTag","<div id='new' class='abc'></div>"]]
                    }
                ]
            }
        ]
    }));
    it("html has expected output", () => expect(result.html).to.contain(`<div id="new" class="abc xyz" alt="greet"><a href="#"> hi </a></div>`));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
