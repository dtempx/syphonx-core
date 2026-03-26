import { Controller } from "./controller.js";
import { Action, Transform } from "./public/index.js";
import { Template } from "../template.js";
import { flattenTemplateTransforms } from "./utilities.js";

/**
 * Options for the standalone {@link transform} function.
 */
export interface TransformOptions {
    /** The URL of the page being transformed, made available to formula expressions as `_url`. */
    url?: string;
    /** Template-level variables, accessible in formula expressions (e.g. `{_myVar}`). */
    vars?: Record<string, unknown>;
    /** When `true`, enables verbose logging of each transform step to the console. */
    debug?: boolean;
    /** A pre-existing data root to seed the controller's `data` object, allowing transforms to reference previously extracted fields. */
    root?: unknown;
}

/**
 * Applies an array of DOM transforms to the current document, modifying the DOM in-place.
 *
 * This is a standalone entry point for running transforms outside of a full `extract()` call.
 * It initializes a {@link Controller} with the given options, then delegates to
 * `controller.transform()` to execute each {@link Transform} step in sequence.
 *
 * If a {@link Template} object is passed instead of a `Transform[]` array, the function
 * flattens all transform actions from the template's `actions` tree before executing them.
 *
 * @param transforms - An array of {@link Transform} steps to apply, or a {@link Template}
 *   whose `actions` will be scanned for embedded transform actions.
 * @param options - Optional {@link TransformOptions} controlling variables, debugging, and
 *   initial data state.
 */
export function transform(transforms: Transform[] | Template, options: TransformOptions = {}): void {
    if (!Array.isArray(transforms) && typeof transforms === "object" && transforms !== null && (transforms as {}).hasOwnProperty("actions"))
        transforms = flattenTemplateTransforms((transforms as { actions: Action[] }).actions);
    const controller = new Controller(options);
    controller.transform(transforms as Transform[]);
}
