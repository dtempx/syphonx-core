import { SelectFormat, SelectQuery, SelectType } from "./Select.js";

export interface QueryParams {
    query?: SelectQuery[];
    type?: SelectType;
    repeated?: boolean;
    all?: boolean;
    format?: SelectFormat;
    pattern?: string;
    limit?: number | null;
    distinct?: boolean;
    negate?: boolean;
    removeNulls?: boolean;
    hits?: number | null;
}
