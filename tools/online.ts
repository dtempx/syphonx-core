import * as fs from "fs";

import {
    evaluateFormula,
    loadJSON,
    online,
    parseArgs
} from "../common/index.js";

const args = parseArgs({
    required: {
        0: "template file to load"
    },
    optional: {
        url: "URL to navigate to",
        show: "shows browser window",
        metadata: "include metadata",
        out: "determines output (data, html, log)"
    }
});

(global as unknown as { script: string }).script = fs.readFileSync(new URL("../dist/iife/syphonx-jquery.min.js", import.meta.url), "utf8");

try {
    const out = args.out ? args.out.split(",") : ["data"];
    const template = await loadJSON(args[0]);
    let url = args.url || template.url;
    if (!url) {
        console.warn("Please specify a URL.");
        process.exit(0);
    }

    const result = await online({
        useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        ...template,
        url: evaluateFormula(`\`${url}\``, template.params),
        show: !!args.show,
        debug: out.includes("log"),
        unwrap: !args.metadata,
        html: out.includes("html")
    });

    if (out.includes("data")) {
        console.log(JSON.stringify(result.data, null, 2));
        console.log();
    }

    if (out.includes("log")) {
        console.log(`status: ${result.status}`);
        console.log(result.log);
        console.log(JSON.stringify(result.vars));
        console.log();
    }

    if (out.includes("html")) {
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
