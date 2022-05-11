import * as path from "path";
import wrap from "word-wrap";

export interface ParseArgsOptions {
    required: {[key: string]: string};
    optional: {[key: string]: string};
    help: Partial<{
        short: string;
        long: string;
        usage: boolean | string;
        params: boolean;
    }>;
    validate?: (args: Record<string, string>) => string|undefined
}

export function parseArgs({ required = {}, optional = {}, help = {}, validate }: Partial<ParseArgsOptions>): Record<string, string> {
    let n = 0;
    const args = process.argv.slice(2).reduce((result, arg) => {
        if (arg.startsWith("--")) {
            const i = arg.indexOf("=");
            if (i >= 0) {
                return {
                    ...result,
                    [arg.substring(2, i)]: arg.substring(i + 1),
                };
            }
            else {
                return {
                    ...result,
                    [arg.substring(2)]: "1",
                };
            }
        }
        else {
            return {
                ...result,
                [n++]: arg,
            };
        }
    }, <{[key: string]: string}>{});

    if (args.help) {
        printHelp({ required, optional, help });
        process.exit();
    }

    if (required) {
        for (const key of Object.keys(required)) {
            if (!(key in args)) {
                console.error(`Argument "${param(key)}" must be specified.`);
                printHelp({ required, optional, help });
                process.exit(); // missing required parameter
            }
        }
    }

    const invalid = Object.keys(args).filter((key) => !/^\d+$/.test(key) && !required[key] && !optional[key]);
    if (invalid.length) {
        console.error(`Invalid argument(s): ${invalid.map((key) => `--${key}`).join(", ")}`);
        printHelp({ required, optional, help });
        process.exit(); // invalid argument(s)
    }

    if (validate) {
        const message = validate(args);
        if (message) {
            console.error(message);
            printHelp({ required, optional, help });
            process.exit(); // invalid argument(s)
        }
    }

    const maxDeclaredFiles = Math.max(
        ...[...Object.keys(required), ...Object.keys(optional)].map((key) => (/^\d+$/.test(key) ? parseInt(key) : 0)),
    );
    const maxSpecifiedFiles = Math.max(...Object.keys(args).map((key) => (/^\d+$/.test(key) ? parseInt(key) : 0)));
    if (maxSpecifiedFiles > maxDeclaredFiles) {
        console.error("Too many argument(s) specified.");
        printHelp({ required, optional, help });
        process.exit(); // too many argument(s) specified
    }

    return args;
}

function printHelp({ required, optional, help }: ParseArgsOptions) {
    console.log();

    if (help.usage === true || help.usage === undefined) {
        console.log(
            "Usage:",
            [
                path.parse(process.argv[1]).name,
                ...Object.keys(required).map((key) => param(key)),
                ...Object.keys(optional).map((key) => `[${param(key)}]`),
            ].join(" "),
        );
    }
    else if (typeof help.usage === "string") {
        console.log("Usage:", path.parse(process.argv[1]).name, help.usage);
    }

    if (help.short) {
        console.log(wrap(help.short));
    }

    if (help.params === true || help.params === undefined) {
        const keys = [...Object.keys(required), ...Object.keys(optional)];
        if (keys.length > 0) {
            console.log();
            console.log("Arguments:");
            for (const key of keys) {
                console.log(`${param(key)}: ${required[key] || optional[key]}`);
            }
        }
    }

    if (help.long) {
        console.log();
        console.log(wrap(help.long));
    }
}

function param(name: string) {
    return /^\d+$/.test(name) ? `file${parseInt(name) + 1}` : `--${name}`;
}
