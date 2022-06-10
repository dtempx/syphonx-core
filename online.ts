import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { browser, loadJSON, parseArgs } from "./common/index.js";
import * as syphonx from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __jquery = fs.readFileSync(path.resolve(__dirname, "./node_modules/jquery/dist/jquery.slim.min.js"), "utf8");

const args = parseArgs({
    optional: {
        0: "script file to load",
        url: "url to navigate to",
        show: "shows browser window",
        debug: "enable debug mode"
    }
});

(async () => {
    try {
        const script = await loadJSON(args[0] || "test.json");
        const headless = !args.show;
        const debug = !!args.debug;
        const url = script.url || args.url;
        if (!url) {
            console.warn("no url specified");
            process.exit(0);
        }

        const page = await browser.open(url, headless);
        // https://stackoverflow.com/questions/46987516/inject-jquery-into-puppeteer-page
        await page.evaluate(__jquery);
        //await page.addScriptTag({ path: path.resolve(__dirname, "./node_modules/jquery/dist/jquery.slim.min.js") });
        //await page.addScriptTag({ url: "https://code.jquery.com/jquery-3.6.0.slim.min.js" });
        
        const { log, ...result } = await page.evaluate(syphonx.extract, { ...script, url, debug });

        console.log(JSON.stringify(result, null, 2));
        if (log) {
            console.log("\n");
            console.log(log);
        }
        process.exit();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
