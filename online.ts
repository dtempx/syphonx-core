import { loadJSON, parseArgs, online } from "./common/index.js";

const args = parseArgs({
    required: {
        0: "script file to load"
    },
    optional: {
        url: "URL to navigate to",
        show: "shows browser window",
        debug: "enable debug mode",
        output: "determines output (data, html, log)"
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

        const result = await online({
            ...script,
            url,
            show: !!args.show,
            debug: !!args.debug,
            includeDOMRefs: false,
            outputHTML: "post"
        });

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
