import { SelectQuery } from "./Select.js";
import { When } from "./When.js";

export interface Transform {
    name?: string;
    query: SelectQuery;
    when?: When;
}
