import { loadJSON, parseArgs, online } from "./common/index.js";

const args = parseArgs({
    required: {
        0: "script file to load"
    },
    optional: {
        url: "URL to navigate to",
        show: "shows browser window",
        debug: "enable debug mode",
        out: "determines output (data, html, log)"
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

        const output = args.out ? args.out.split(",") : ["data"];
        const debug = !!args.debug || output.includes("log");

        const result = await online({
            ...script,
            url,
            show: !!args.show,
            debug,
            includeDOMRefs: false,
            outputHTML: "post"
        });

        if (output.includes("data")) {
            console.log(JSON.stringify(result.data, null, 2));
            console.log();
        }

        if (output.includes("log")) {
            console.log(`status: ${result.status}`);
            console.log(result.log);
            console.log();
        }

        if (output.includes("html")) {
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
