import { SelectQuery } from "./Select.js";
import { When } from "./When.js";

export interface Scroll {
    name?: string;
    query?: SelectQuery[];
    target?: ScrollTarget; // Determines the target of the scroll as top, bottom, or query
    behavior?: ScrollBehavior; // Determines whether to scroll smoothly or immediately jump to target (default=smooth)
    block?: ScrollLogicalPosition; // Determines vertical alignment (default=start)
    inline?: ScrollLogicalPosition; // Determines horizontal alignment (default=nearest)
    when?: When;
}

export type ScrollTarget =
      "top"
    | "bottom";
