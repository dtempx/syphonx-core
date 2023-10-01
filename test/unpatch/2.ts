import { expect } from "chai";
import { browser } from "../common.js";
import { unpatch } from "../../extract/lib/unpatch.js";

describe("unpatch/2", async () => {
    let val1: string;
    let val2: string;
    let val3: string;
    
    before(async () => {
        const page = await browser.open("https://www.example.com/");
        await page.waitForTimeout(2000);
        val1 = await page.evaluate(async () => window.String.prototype.startsWith.toString());
        await browser.close(page);
        return val1;
    });
    
    before(async () => {
        // if this page ever removes their monkey-patch for String.prototype.startsWith
        // use await.exposeFunction("String.prototype.startsWith", () => {}) to force a monkey-patch
        const page = await browser.open("https://kakaku.com/item/K0001466409/");
        await page.waitForTimeout(2000);
        val2 = await page.evaluate(async () => window.String.prototype.startsWith.toString());
        await browser.close(page);
        return val2;
    });

    before(async () => {
        const page = await browser.open("https://kakaku.com/item/K0001466409/");
        await page.waitForTimeout(2000);
        await page.exposeFunction("unpatch", unpatch);
        await page.addScriptTag({ content: `${unpatch}` });
        val3 = await page.evaluate(async () => {
            unpatch(["String.prototype.startsWith"]);
            return window.String.prototype.startsWith.toString();
        });
        await browser.close(page);
        return val3;
    });

    it("example of site monkey-patching primitive type javascript function", () => expect(val1).to.not.equal(val2));
    it("unpatch should correct monkey-patching for primitive type javascript functions", () => expect(val1).to.be.equal(val3));
});
