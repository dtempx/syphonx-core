import { DocumentLoadState } from "./DocumentLoadState.js";
import { When } from "./When.js";

export interface Navigate {
    name?: string;
    url: string;
    waitUntil?: DocumentLoadState;
    when?: When;
}
