export function typeName(obj: unknown): string {
    if (obj === null)
        return "null";
    else if (obj === undefined)
        return "undefined";
    else if (typeof obj === "string")
        return "string"
    else if (typeof obj === "number")
        return "number";
    else if (obj instanceof Array)
        return obj.length > 0 ? `Array<${Array.from(new Set(obj.map(value => typeName(value)))).join("|")}>` : "[]";
    else if (obj instanceof Date)
        return "date";
    else if (typeof obj === "object")
        return "object";
    else
        return "unknown";
}
