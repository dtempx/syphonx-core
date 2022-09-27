import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <section>
            <div>
                <ul>
                    <li>news</li>
                    <li>weather</li>
                    <li>sports</li>
                </ul>
            </div>
            <div>
                <p>ABC</p>
                <p>NBC</p>
                <p>CBS</p>
            </div>
        </section>
    `,
    actions: [
        {
            "each": {
                "$": [["ul > li"]],
                "context": null,
                "actions": [
                    {
                        "select": [
                            {
                                "name": "a1",
                                "type": "string",
                                "repeated": true,
                                "$": [["{`p:eq(${parent.index})`}",["map","{`${parent.index}:${parent.value}:${value}`}"]]]
                            }
                        ]
                    }
                ]
            }
        }
    ] as syphonx.Action[]
};

describe("each/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("a1 has expected value", () => expect(result.data.a1).to.be.eql(["0:news:ABC","1:weather:NBC","2:sports:CBS"]));
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});