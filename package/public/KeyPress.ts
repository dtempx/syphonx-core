import { When } from "./When.js";

export interface KeyPress {
    name?: string;
    key: string;
    shift?: boolean;
    control?: boolean;
    alt?: boolean;
    when?: When;
}
