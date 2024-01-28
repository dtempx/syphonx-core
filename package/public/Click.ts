import { DocumentLoadState } from "./DocumentLoadState.js";
import { SelectQuery } from "./Select.js";
import { SnoozeInterval } from "./Snooze.js";
import { WaitFor } from "./WaitFor.js";
import { When } from "./When.js";

export interface Click {
    name?: string;
    query: SelectQuery[];
    waitfor?: WaitFor; // skip if no nodes selected
    snooze?: SnoozeInterval;
    required?: boolean;
    retry?: number; // not implemented
    yield?: boolean;
    waitUntil?: DocumentLoadState;
    when?: When;
}
