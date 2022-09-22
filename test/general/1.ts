import { expect } from "chai";
import { syphonx, offline } from "../common.js";

const test = {
    url: "https://www.example.com/",
    html: `
        <html>
            <head>
                <title>Example Domain</title>
            </head>
            <body>
                <div>
                    <h1>Example Domain</h1>
                    <p>This domain is for use in illustrative examples in documents. You may use this
                    domain in literature without prior coordination or asking for permission.</p>
                    <p><a href="https://www.iana.org/domains/example">More information...</a></p>
                </div>
            </body>
        </html>
    `,
    actions: [
        {
            "select": [
                {
                    "$": [["h1"]]
                }
            ]
        }
    ] as syphonx.Action[]
};

describe("general/1", () => {
    let result: syphonx.ExtractResult;
    before(async () => result = await offline(test));
    it("result.url has expected value", () => expect(result.url).to.be.equal("https://www.example.com/"));
    it("result.domain has expected value", () => expect(result.domain).to.be.equal("example.com"));
    it("result.data has expected value", () => expect(result.data).to.be.equal("Example Domain"));
    it("result.online is false", () => expect(result.online).to.be.false);
    it("ok is true", () => expect(result.ok).to.be.true);
    it("no errors", () => expect(result.errors).to.be.empty);
});
