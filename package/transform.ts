import { Controller } from "./controller.js";
import { Action, Transform } from "./public/index.js";
import { Template } from "../template.js";
import { flattenTemplateTransforms } from "./utilities.js";

export interface TransformOptions {
    url?: string;
    vars?: Record<string, unknown>;
    debug?: boolean;
    root?: unknown;
}

export function transform(transforms: Transform[] | Template, options: TransformOptions = {}): void {
    if (!Array.isArray(transforms) && typeof transforms === "object" && transforms !== null && (transforms as {}).hasOwnProperty("actions"))
        transforms = flattenTemplateTransforms((transforms as { actions: Action[] }).actions);
    const controller = new Controller(options);
    controller.transform(transforms as Transform[]);
}
