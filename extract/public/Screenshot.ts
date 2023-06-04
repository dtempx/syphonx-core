import { When } from "./When.js";

export interface Screenshot {
    name?: string;
    selector?: string;
    when?: When;
}
