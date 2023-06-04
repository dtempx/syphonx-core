import {
    QueryResult,
    SelectFormat,
    SelectQuery,
    SelectType
} from "../public/index.js";

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
