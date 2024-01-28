import { combineUrl } from "./combineUrl.js";
import { collapseWhitespace } from "./collapseWhitespace.js";
import { isAbsoluteUrl } from "./is.js";
import { SelectFormat } from "../index.js";

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
