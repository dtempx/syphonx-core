import { When } from "./When.js";

export interface Screenshot {
    name?: string;
    selector?: string;
    fullPage?: boolean;
    params?: Record<string, unknown>;
    when?: When;
}
