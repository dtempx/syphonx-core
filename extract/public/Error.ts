import { ExtractErrorCode } from "./ExtractErrorCode.js";
import { SelectQuery } from "./Select.js";
import { When } from "./When.js";

export interface Error {
    name?: string;
    code?: ExtractErrorCode; // required, default is "app-error"
    message: string; // optional default based on code
    level?: number; // indicates error level, 0 is non-retryable, 1 or above is retryable (default=1)
    stop?: boolean; // stops processing, default is false if level is 0 or not specified, otherwise true
    query?: SelectQuery[]; // boolean
    negate?: boolean; // Negates the query, producing an error if an element is found.
    when?: When;
}
