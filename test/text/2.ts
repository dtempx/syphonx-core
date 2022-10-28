import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
    <p><span class=ms-rteFontSize-2><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1
    ms-rteFontSize-2"">Mike</span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1
    ms-rteFontSize-2""> is a
</span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1 ms-rteFontSize-2"">specialist
    materials engineer</span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1 ms-rteFontSize-2"">
    within the </span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1 ms-rteFontSize-2"">Advanced
    Digital Engineering</span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1 ms-rteFontSize-2"">
    team in </span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1
    ms-rteFontSize-2"">London</span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1
    ms-rteFontSize-2"">, </span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1
    ms-rteFontSize-2"">Mike</span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1
    ms-rteFontSize-2"">
    primarily works on </span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1
    ms-rteFontSize-2"">glass and complex diagnostics </span><span class="" ms-rteThemeForeColor-2-0
    ms-rteThemeFontFace-1 ms-rteFontSize-2"">projects
    and is developing </span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1
    ms-rteFontSize-2"">the firms capability for digital
    fabrication</span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1 ms-rteFontSize-2"">.
</span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1 ms-rteFontSize-2"">Mike</span><span
    class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1 ms-rteFontSize-2""> is
    also </span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1 ms-rteFontSize-2"">the
    global materials skill manager is a
    knowledge leader</span><span class="" ms-rteThemeForeColor-2-0 ms-rteThemeFontFace-1
    ms-rteFontSize-2"">.&nbsp;</span>?&nbsp;</span></p>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "p1",
                    "$": [["p"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("text/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("p1 has expected value", () => expect(result.data.p1).to.be.equal("Sed volutpat dolor lectus sit amet"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
