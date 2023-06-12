import { SelectFormat, SelectQuery, SelectType } from "../public/index.js";
import { QueryResult } from "./QueryResult.js";

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
