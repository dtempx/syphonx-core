import * as fs from "fs";
import { browser, loadJSON, parseArgs, offline } from "./common/index.js";

const args = parseArgs({
    required: {
        0: "script file to load"
    },
    optional: {
        1: "HTML file to load",
        url: "URL to navigate to",
        out: "determines output (data, html, log)"
    },
    validate: args => {
        if (!args[1] && !args.url) {
            return "Please specify either an HTML file or a URL.";
        }
    }
});

(async () => {
    try {
        const out = args.output ? args.output.split(",") : ["data"];
        const script = await loadJSON(args[0]);
        const url = script.url || args.url;
        const html = args[1] ? fs.readFileSync(args[1], "utf8") : await browser.html(url, true);

        const result = await offline({
            ...script,
            url,
            html,
            debug: out.includes("log"),
            includeDOMRefs: false
        });

        if (out.includes("data")) {
            console.log(JSON.stringify(result.data, null, 2));
            console.log();
        }

        if (result.log && out.includes("log")) {
            console.log(result.log);
            console.log();
        }

        if (result.html && out.includes("html")) {
            console.log(result.html);
            console.log();
        }

        if (!result.ok) {
            console.error("ERRORS");
            console.error(JSON.stringify(result.errors, null, 2));
        }

        process.exit();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
