import { SelectQuery, SelectQueryOp } from "../index.js";

export function selectorStatement(query: SelectQuery): string {
    const valid = query instanceof Array && query.length > 0 && typeof query[0] === "string" && query.slice(1).every(op => op instanceof Array);
    if (!valid) {
        return `INVALID: ${JSON.stringify(query)}`;
    }
    const selector = query[0];
    const ops = query.slice(1) as SelectQueryOp[];
    return [`$("${selector}")`, ...ops.map(op => `${op[0]}(${op.slice(1).map(param => JSON.stringify(param)).join(", ")})`)].join(".");
}

export function selectorStatements(query: SelectQuery[] | undefined): string {
    if (query && query.length > 0)
        return `${selectorStatement(query[0])}${query.length > 1 ? ` (+${query.length - 1} more))` : ""}`;
    else
        return "(none)";
}
