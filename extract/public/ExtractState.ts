import { ExtractError } from "./ExtractError";
import { Action } from "./Action.js";
import { YieldState } from "./Yield.js";

export interface ExtractState {
    [key: string]: any;
    actions: Action[];
    url: string;
    domain: string;
    origin: string;
    params: Record<string, unknown>;
    vars: Record<string, unknown>;
    data: any;
    log: string;
    errors: ExtractError[];
    debug: boolean;
    yield?: YieldState;
    root?: unknown;
    originalUrl?: string;
    unpatch: string[];
    version: string;
}
