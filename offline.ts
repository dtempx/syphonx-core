import * as cheerio from "cheerio";
import * as fs from "fs";
import { browser, loadJSON, parseArgs } from "./common/index.js";
import * as syphonx from "./index.js";

const args = parseArgs({
    required: {
        0: "script file to load"
    },
    optional: {
        1: "HTML file to load",
        url: "URL to navigate to",
        debug: "enable debug mode",
        output: "determines output (data, html, log)"
    },
    validate: args => {
        if (!args[1] && !args.url) {
            return "Please specify either an HTML file or a URL.";
        }
    }
});

(async () => {
    try {
        const script = await loadJSON(args[0]);
        const url = script.url || args.url;
        if (!url) {
            console.warn("Please specify a URL.");
            process.exit(0);
        }

        const html = args[1] ? fs.readFileSync(args[1], "utf8") : await browser.html(url, true);
        const root = cheerio.load(html);
        const debug = !!args.debug;
        const result = await syphonx.extract({ ...script, url, root, debug });

        const output = args.output ? args.output.split(",") : ["data", "log"];
        if (output.includes("data")) {
            console.log(JSON.stringify(result.data, null, 2));
            console.log();
        }

        if (result.log && output.includes("log")) {
            console.log(result.log);
            console.log();
        }

        if (result.html && output.includes("html")) {
            console.log(result.html);
            console.log();
        }

        process.exit();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
