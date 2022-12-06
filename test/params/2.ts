import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const params = {
    en: {
        name: "Name",
        city: "City"
    },
    it: {
        name: "Nom",
        city: "Città"
    }
};

const actions = [
    {
        "select": [
            {
                "name": "_lang",
                "query": [
                    ["h3:contains('Name')",["map","en"]],
                    ["h3:contains('Nom')",["map","it"]]
                ]
            },
            {
                "name": "name",
                "query": [["{`h3:contains('${params[_lang]?.name}') + div`}"]]
            }
        ]
    }
] as syphonx.Action[];

const content = {
    en: `
        <h3>Name</h3>
        <div>John Doe</div
        <h3>City</h3>
        <div>New York</div>
    `,
    it: `
        <h3>Nom</h3>
        <div>Mario Rossi</div
        <h3>Città</h3>
        <div>Roma</div>
    `
};

describe("params/2/en", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline({ params, actions, html: content.en }));
    it("_lang has expected value", () => expect(result.vars._lang).to.be.equal("en"));
    it("name has expected value", () => expect(result.data.name).to.be.equal("John Doe"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});

describe("params/2/it", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline({ params, actions, html: content.it }));
    it("_lang has expected value", () => expect(result.vars._lang).to.be.equal("it"));
    it("name has expected value", () => expect(result.data.name).to.be.equal("Mario Rossi"));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
