import { ExtractState } from "./ExtractState.js";

export interface ExtractResult extends Omit<ExtractState, "yield" | "root"> {
    ok: boolean;
    status: number;
    html: string;
    version: string;
}
