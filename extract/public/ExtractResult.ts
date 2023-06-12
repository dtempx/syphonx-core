import { ExtractState } from "./ExtractState.js";

export interface ExtractResult extends Omit<ExtractState, "yield" | "root"> {
    ok: boolean;
    html?: string;
    status?: number;
    version: string;
}
