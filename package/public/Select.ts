import { When } from "./When.js";

/**
 * Represents a target for selection operations.
 */
export interface SelectTarget {
    /**
     * An array of queries to be executed.
     */
    query?: SelectQuery[];
    /**
     * A pivot target for the selection.
     */
    pivot?: SelectTarget;
    /**
     * An array of sub-selections to be executed.
     */
    select?: Select[];
    /**
     * A value to be used in the selection. Executes after query if both are used.
     */
    value?: unknown;
    /**
     * Includes all query stage hits instead of just the first stage. Default is false.
     */
    all?: boolean;
    /**
     * @deprecated Use `all` instead. Limits the number of query stage hits. Default is unlimited or specify null for unlimited.
     */
    hits?: number | null;
    /**
     * Limits the number of nodes returned by the query. Default is 1 when repeated is false and all is false, otherwise unlimited. Specify null to force unlimited nodes.
     */
    limit?: number | null;
    /**
     * The format of the selection. Default is multiline when type is string.
     */
    format?: SelectFormat;
    /**
     * A validation pattern. Only applies if type is string.
     */
    pattern?: string;
    /**
     * Causes the selector to be processed as a single unit rather than for each node or each value.
     */
    collate?: boolean;
    /**
     * An optional comment for the selector.
     */
    comment?: string;
    /**
     * Sets the context of the selector query. Default is 1. Specify null for global context.
     */
    context?: number | null;
    /**
     * Removes duplicate values from arrays.
     */
    distinct?: boolean;
    /**
     * Negates a boolean result.
     */
    negate?: boolean;
    /**
     * Removes null values from arrays.
     */
    removeNulls?: boolean;
    /**
     * Waits for the selector to appear when loading the page.
     */
    waitfor?: boolean;
    /**
     * A condition that must be met for the selection to occur. SKIPPED actions indicate an unmet condition, BYPASSED actions indicate unexecuted actions in offline mode.
     */
    when?: When;
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
