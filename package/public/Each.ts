import { Action } from "./Action.js";
import { SelectQuery } from "./Select.js";
import { When } from "./When.js";

export interface Each {
    name?: string;
    query: SelectQuery[]; // boolean, an error is produced if no element is found.
    actions: Action[];
    context?: number | null; // sets context of selector query, or specify null for global context (default=1)
    when?: When;
}