import { Action } from "./Action.js";
import { SelectQuery } from "./Select.js";
import { When } from "./When.js";

export interface Switch {
    name?: string;
    query?: SelectQuery[];
    actions: Action[];
    when?: When;
}
