import { SelectType } from "../index.js";
import { parseBoolean, parseNumber } from "./parse.js";

export function coerce(value: unknown, type: string): unknown {
    if (type === "number")
        return parseNumber(value);
    else if (type === "boolean")
        return parseBoolean(value);
    else
        return value;
}

export function coerceSelectValue(value: unknown, type: SelectType | undefined, repeated?: boolean): unknown {
    if (repeated) {
        return value instanceof Array ? value.map(v => coerceSelectValue(v, type, false)) : [coerceSelectValue(value, type, false)];
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

export function isCoercibleTo(value: unknown, type: string): boolean {
    if (type === "number" && typeof value === "string" && parseNumber(value) !== undefined)
        return true;
    else if (type === "boolean" && typeof value === "string" && parseBoolean(value) !== undefined)
        return true;
    else
        return false;
}
