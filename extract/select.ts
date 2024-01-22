import { Controller } from "./controller.js";
import { Action, ExtractState, Select } from "./public/index.js";
import { flattenTemplateSelect } from "./utilities.js";
import { Template } from "../template.js";

export interface SelectOptions {
    url?: string;
    vars?: Record<string, unknown>;
    debug?: boolean;
    context?: string;
    root?: unknown;
}

export function select(selects: Select[] | Template, options: SelectOptions = {}): ExtractState {
    if (!Array.isArray(selects) && typeof selects === "object" && selects !== null && (selects as {}).hasOwnProperty("actions"))
        selects = flattenTemplateSelect((selects as { actions: Action[] }).actions);
    const controller = new Controller(options);
    const data = controller.select(selects as Select[]);
    return { ...controller.state, data };
}
