import { Action, DocumentLoadState } from "./extract/index.js";

export interface Template {
    actions: Action[];
    url?: string;
    params?: Record<string, unknown>;
    vars?: Record<string, unknown>;
    debug?: boolean;
    useragent?: string;
    headers?: Record<string, string>;
    timeout?: number;
    viewport?: { width: number, height: number };
    waitUntil?: DocumentLoadState;
}
