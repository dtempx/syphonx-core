import { ExtractState } from "./ExtractState.js";
import { Metrics } from "./Metrics.js"

export interface ExtractResult extends Omit<ExtractState, "yield" | "root"> {
    ok: boolean;
    html?: string;
    status?: number;
    version: string;
    metrics: Metrics;
}
