import * as cheerio from "cheerio";
//import * as fs from "fs";
//import * as path from "path";
//import { fileURLToPath } from "url";
import { browser, loadJSON, parseArgs } from "./common/index.js";
import * as syphonx from "./index.js";

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
//const __jquery = fs.readFileSync(path.resolve(__dirname, "./node_modules/jquery/dist/jquery.min.js"), "utf8");

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
        const url = script.url || args.url;
        if (!url) {
            console.warn("no url specified");
            process.exit(0);
        }
        const html = await browser.html(url, true);
        const root = cheerio.load(html);
        const debug = !!args.debug;
        const { log, ...result } = await syphonx.extract({ ...script, url, root, debug });
        
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
