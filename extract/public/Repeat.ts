import { Action } from "./Action.js";
import { When } from "./When.js";

export interface Repeat {
    name?: string;
    actions: Action[];
    limit?: number | string; // max # of repitions (default=100) or a forumla to calculate the limit
    errors?: number; // error limit (default=1)
    when?: When;
}
