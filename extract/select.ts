import { Controller } from "./controller.js";
import { ExtractState, Select } from "./public/index.js";

export interface SelectOptions {
    url?: string;
    vars?: Record<string, unknown>;
    debug?: boolean;
    context?: string;
    root?: unknown;
}

export function select(selects: Select[], options: SelectOptions = {}): ExtractState {
    const controller = new Controller(options);
    const data = controller.select(selects);
    return { ...controller.state, data };
}
