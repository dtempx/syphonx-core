import {
    ExtractState,
    JQueryResult,
    QueryResult,
    SelectFormat,
    SelectQuery,
    SelectQueryOp,
    SelectType
} from "../public/index.js";

export type SelectContextAction = "each" | "pivot" | "subselect" | "union"
export type DispatchResult = "break" | "yield" | "timeout" | "required" | null;

export interface DataItem {
    key: string;
    value: unknown;
    nodes: string[];
}

export interface ExtractStateInternal extends ExtractState {
    vars: ExtractStateInternalVars;
}

export interface ExtractStateInternalVars extends Record<string, unknown> {
    __instance: number;
    __context: SelectContext[];
    __repeat: Record<number, RepeatState | undefined>;
    __step: number[];
    __yield: number[] | undefined;
    __yield_result?: unknown;
}

export interface RepeatState {
    index: number;
    errors: number;
}

export interface ResolveQueryParams {
    query: SelectQuery;
    repeated: boolean;
    all: boolean;
    limit: number | null | undefined;
    type?: SelectType;
    format?: SelectFormat;
    pattern?: string;
    distinct?: boolean;
    negate?: boolean;
    removeNulls?: boolean;
    result?: QueryResult;
}

export interface ResolveQueryOpsParams {
    ops: SelectQueryOp[];
    nodes: JQueryResult;
    value: unknown;
    type?: SelectType;
    repeated: boolean;
    all: boolean;
    limit?: number | null;
    format?: SelectFormat;
    pattern?: string;
    distinct?: boolean;
    negate?: boolean;
    removeNulls?: boolean;
}

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
