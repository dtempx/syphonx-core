import { SelectQuery, SelectOn } from "./Select.js";
import { When } from "./When.js";

export interface Break {
    name?: string;
    query?: SelectQuery[]; // boolean
    on?: SelectOn; // only used with query
    pattern?: string; // only used with query, waits for a specific text pattern if specified
    when?: When; // if when is specified then when is evaluated first, and then query is evaluated next if specified, if when not specified then query is evaluated by itself
}
