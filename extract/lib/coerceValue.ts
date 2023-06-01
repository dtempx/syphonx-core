import { SelectType } from "../index.js";
import { parseNumber } from "./parse.js";

export function coerceValue(value: unknown, type: SelectType | undefined, repeated?: boolean): unknown {
    if (repeated) {
        return value instanceof Array ? value.map(v => coerceValue(v, type, false)) : [coerceValue(value, type, false)];
    }            
    else if (type === "string") {
        return typeof value === "string" ? value : typeof value === "number" || typeof value === "boolean" ? value.toString() : null;
    }
    else if (type === "number") {
        return typeof value === "number" ? value : typeof value === "string" ? parseNumber(value) : null;
    }
    else if (type === "boolean") {
        return typeof value === "boolean" ? value : typeof value === "string" ? value.trim().length > 0 : typeof value === "number" && !isNaN(value) ? value !== 0 : null;
    }
    else {
        return value;
    }    
}