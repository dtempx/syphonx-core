import {
    JQueryResult,
    SelectFormat,
    SelectQueryOp,
    SelectType
} from "../public/index.js";

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
