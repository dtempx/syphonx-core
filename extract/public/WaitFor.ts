import { Select, SelectQuery, SelectOn } from "./Select.js";
import { When } from "./When.js";

export interface WaitFor {
    name?: string;
    query?: SelectQuery[];
    select?: Select[];
    on?: SelectOn; // used with query or select
    timeout?: number; // used with query or select
    pattern?: string; // waits for a specific text pattern if specified
    required?: boolean; // indicates whether processing should stop with an error on timeout
    when?: When; // if when is specified then when is evaluated first, and then query or select is evaluated next if specified, if when not specified then query or select are evaluated by itself
}
