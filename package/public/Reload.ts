import { DocumentLoadState } from "./DocumentLoadState.js";
import { When } from "./When.js";

export interface Reload {
    name?: string;
    waitUntil?: DocumentLoadState;
    when?: When;
}
