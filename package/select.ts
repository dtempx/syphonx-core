import { Controller } from "./controller.js";
import { Action, ExtractState, Select } from "./public/index.js";
import { flattenTemplateSelect } from "./utilities.js";
import { Template } from "../template.js";
import { unwrap } from "./lib/unwrap.js";

export interface SelectOptions {
    url?: string;
    vars?: Record<string, unknown>;
    debug?: boolean;
    context?: string;
    root?: unknown;
    unwrap?: boolean;
}

export function select(selects: Select[] | Template, options: SelectOptions = {}): ExtractState {
    if (!Array.isArray(selects) && typeof selects === "object" && selects !== null && (selects as {}).hasOwnProperty("actions"))
        selects = flattenTemplateSelect((selects as { actions: Action[] }).actions);
    const controller = new Controller(options);
    let data = controller.select(selects as Select[]);
    if (options.unwrap)
        data = unwrap(data);
    return { ...controller.state, data };
}
