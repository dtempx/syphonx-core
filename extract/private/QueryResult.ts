import { JQueryResult } from "./JQuery.js";

export interface QueryResult {
    nodes: JQueryResult;
    key: string;
    value: unknown;
    valid?: boolean;
    formatted?: boolean;
    raw?: boolean;
}
