import { combineUrl } from "./combineUrl.js";
import { collapseWhitespace } from "./collapseWhitespace.js";
import { isAbsoluteUrl } from "./is.js";
import { SelectFormat, SelectQuery } from "../index.js";

export function formatStringValue(value: string, format: SelectFormat, origin: string): unknown {
    if (format === "href" && typeof value === "string" && origin && !isAbsoluteUrl(value)) {
        return combineUrl(origin, value);
    }
    else if (format === "multiline") {
        return collapseWhitespace(value, true);
    }
    else if (format === "singleline") {
        return collapseWhitespace(value, false);
    }
    else if (format === "none") {
        return value;
    }
    else {
        return value;
    }
}

export function inferFormatFromQuery(query: SelectQuery[]): SelectFormat | undefined {
    for (const stage of query) {
        for (let i = 1; i < stage.length; i++) {
            const op = stage[i];
            if (op instanceof Array && op[0] === "attr" && (op[1] === "href" || op[1] === "src"))
                return "href";
        }
    }
    return undefined;
}
