import { JQueryResult } from "./JQuery.js";

export type SelectContextAction = "each" | "pivot" | "subselect" | "union"

export interface SelectContext {
    name?: string;
    nodes?: JQueryResult;
    value?: unknown;
    index?: number;
    pivot?: number;
    union?: number;
    action?: SelectContextAction;
    parent?: SelectContext;
}
