import { When } from "./When.js";

export interface SelectTarget {
    query?: SelectQuery[];
    pivot?: SelectTarget;
    select?: Select[];
    value?: unknown; // if both query and value are used, value executes after query
    all?: boolean; // includes all query stage hits instead of just the first stage (default=false)
        // if values are arrays then results are merged
        // if values are strings then results are concatenated with newlines
        // if values are booleans then results are and'ed together
        // otherwise the latest result takes precedence
    hits?: number | null; // DEPRECATED, use `all` instead // limits the number of query stage hits, default is unlimited or specify null for unlimited (null)
    limit?: number | null; // limits the number of nodes returned by the query, when repeated is false and all is false then default=1 otherwise default is unlimited (null), specify null to force unlimited nodes
    format?: SelectFormat; // default is multiline when type=string, whitespace is added for multiline and singleline, none is the same as text(), innertext and textcontent only work online
    pattern?: string; // validation pattern (only applies if type=string)
    collate?: boolean; // causes selector to be processed as a single unit rather than processed as a single unit rather than for each node or each value
    context?: number | null; // sets context of selector query, or specify null for global context (default=1)
    distinct?: boolean; // removes duplicate values from arrays
    negate?: boolean; // negates a boolean result
    removeNulls?: boolean; // removes null values from arrays
    when?: When; // SKIPPED actions indicate an unmet when condition, BYPASSED actions indicate unexecuted actions in offline mode
}

export interface Select extends SelectTarget {
    name?: string; // if not defined then value is projected
    repeated?: boolean; // if repeated is true then an array is returned, othewise if type is string then strings will be newline concatenated otherwise if type is boolean then all values are and'ed otherwise the first value is taken, default is false
    required?: boolean; // indicates whether an error should result if no value selected, default is false
    type?: SelectType; // default is "string" except when there is a sub-select in which case default is "object"
    union?: SelectTarget[];
}

export type SelectType = "string" | "number" | "boolean" | "object"; // document how formatResult works and coerceValue converts different values to the target type
export type SelectQuery = [string, ...SelectQueryOp[]];
export type SelectQueryOp = [string, ...unknown[]];
export type SelectQueryOperator = string;
export type SelectQueryOperand = unknown;
export type SelectFormat = "href" | "multiline" | "singleline" | "innertext" | "textcontent" | "none";
export type SelectOn = "any" | "all" | "none";
