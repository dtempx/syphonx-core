import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { browser, loadJSON, parseArgs } from "./common/index.js";
import * as syphonx from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __jquery = fs.readFileSync(path.resolve(__dirname, "./node_modules/jquery/dist/jquery.min.js"), "utf8");

const args = parseArgs({
    optional: {
        0: "script file to load",
        url: "url to navigate to",
        debug: "enable debug mode"
    }
});

(async () => {
    try {
        const script = await loadJSON(args[0] || "script.json");
        const debug = !!args.debug;
        const url = script.url || args.url;
        if (!url) {
            console.warn("no url specified");
            process.exit(0);
        }

        const page = await browser.open(url, false);
        await page.evaluate(__jquery); // https://stackoverflow.com/questions/46987516/inject-jquery-into-puppeteer-page
        const { log, ...result } = await page.evaluate(syphonx.extract, { ...script, url, debug });

        console.log(JSON.stringify(result, null, 2));
        if (log) {
            console.log();
            console.log(log);
        }
        process.exit();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
