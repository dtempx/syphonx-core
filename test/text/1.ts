import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <h1>Lorum Ipsum</h1>
        <p>
            Sed volutpat <b>dolor lectus</b> sit amet
        </p>
        <section id="s1">
            <h3>Vestibulum</h3><div>Etiam vel imperdiet erat.</div>
        </section>
        <section id="s2">
            Suspendisse<br>Praesent sit amet pellentesque eros.
        </section>
        <div id="d1">Fogo<i>de</i>Chow</div>
        <div id="d2">Fogo<i>de</i>Chow</div>
        <div id="d3">
            Lorum
            Ipsum
        </div>
        <q>  In  vino  veritas  </q>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "h1",
                    "$": [["h1"]]
                },
                {
                    "name": "p1",
                    "$": [["p"]]
                },
                {
                    "name": "p2",
                    "$": [["p",["text","inline"]]]
                },
                {
                    "name": "s1",
                    "$": [["#s1"]]
                },
                {
                    "name": "s2",
                    "$": [["#s2"]]
                },
                {
                    "name": "d1",
                    "$": [["#d1"]]
                },
                {
                    "name": "d2",
                    "$": [["#d2"]],
                    "format": "none"
                },
                {
                    "name": "d3",
                    "$": [["#d3"]],
                    "format": "singleline"
                },
                {
                    "name": "d4",
                    "$": [["#d3"]],
                    "format": "multiline"
                },
                {
                    "name": "q1",
                    "$": [["q"]]
                },
                {
                    "name": "q2",
                    "$": [["q"]],
                    "format": "innerhtml"
                },
                {
                    "name": "q3",
                    "$": [["q"]],
                    "format": "textcontent"
                },
                {
                    "name": "q4",
                    "$": [["q"]],
                    "format": "none"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("text/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("h1 has expected value", () => expect(result.data.h1).to.be.equal("Lorum Ipsum"));
    it("p1 has expected value", () => expect(result.data.p1).to.be.equal("Sed volutpat dolor lectus sit amet"));
    it("p2 has expected value", () => expect(result.data.p2).to.be.equal("Sed volutpat sit amet"));
    it("s1 has expected value", () => expect(result.data.s1).to.be.equal("Vestibulum Etiam vel imperdiet erat."));
    it("s2 has expected value", () => expect(result.data.s2).to.be.equal("Suspendisse\nPraesent sit amet pellentesque eros."));
    it("d1 has expected value", () => expect(result.data.d1).to.be.equal("Fogo de Chow"));
    it("d2 has expected value", () => expect(result.data.d2).to.be.equal("FogodeChow"));
    it("d3 has expected value", () => expect(result.data.d3).to.be.equal("Lorum Ipsum"));
    it("d4 has expected value", () => expect(result.data.d4).to.be.equal("Lorum\nIpsum"));
    it("q1 has expected value", () => expect(result.data.q1).to.be.equal("In vino veritas"));
    it("q2 has expected value", () => expect(result.data.q2).to.be.equal("In vino veritas"));
    it("q3 has expected value", () => expect(result.data.q3).to.be.equal("In vino veritas"));
    it("q4 has expected value", () => expect(result.data.q4).to.be.equal("  In  vino  veritas  "));
});
