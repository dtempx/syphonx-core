import { evaluateFormula, loadJSON, online, parseArgs } from "./common/index.js";

const args = parseArgs({
    required: {
        0: "template file to load"
    },
    optional: {
        url: "URL to navigate to",
        show: "shows browser window",
        out: "determines output (data, html, log)"
    }
});

(async () => {
    try {
        const out = args.out ? args.out.split(",") : ["data"];
        const template = await loadJSON(args[0]);
        let url = template.url || args.url;
        if (!url) {
            console.warn("Please specify a URL.");
            process.exit(0);
        }

        const result = await online({
            ...template,
            url: evaluateFormula(`\`${url}\``, template.params),
            show: !!args.show,
            debug: out.includes("log"),
            includeDOMRefs: false,
            outputHTML: "post"
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
})();
