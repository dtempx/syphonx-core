import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    html: `
        <section>
            <div>
                <span class="name">apple</span>
                <span class="type">fruit</span>
            </div>
        </section>
    `,
    actions: [
        {
            "select": [
                {
                    "name": "a1",
                    "type": "object",
                    "value": "{{ name: 'apple', type: 'fruit' }}"
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("value/2", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    //it("a1 has expected value in obj", () => expect(result.data.a1).eql({ "name": "apple", "type": "fruit" }));
    it("a1 has expected value in obj", () => expect(result.data.a1).eql({ "name": "apple", "type": "fruit" }));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
