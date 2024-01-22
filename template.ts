import { Action, DocumentLoadState } from "./extract/index.js";

/**
 * Represents a SyphonX template.
 */
export interface Template {
    /** Set of actions performed by the template. */
    actions: Action[];
    /** Default URL for the template. Can be overridden by various means. */
    url?: string;
    params?: Record<string, unknown>;
    vars?: Record<string, unknown>;
    debug?: boolean;
    useragent?: string;
    headers?: Record<string, string>;
    /** Timeout interval in seconds for page navigation, reload, and goback. */
    timeout?: number;
    unpatch?: string[];
    viewport?: { width: number, height: number };
    waitUntil?: DocumentLoadState;
}
