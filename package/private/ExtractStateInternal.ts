import { ExtractState, Metrics } from "../public/index.js";
import { RepeatState } from "./RepeatState.js";
import { SelectContext } from "./SelectContext.js";

export interface ExtractStateInternal extends ExtractState {
    vars: ExtractStateInternalVars;
}

export interface ExtractStateInternalVars extends Record<string, unknown> {
    __instance: number;
    __context: SelectContext[];
    __metrics: Metrics;
    __repeat: Record<number, RepeatState | undefined>;
    __step: number[];
    __t0: number;
    __timeout: number;
    __yield: number[] | undefined;
    __yield_result?: unknown;
}
