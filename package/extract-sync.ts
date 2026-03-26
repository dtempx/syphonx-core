import { Controller } from "./controller.js";
import { ExtractState, SelectAction, TransformAction } from "./public/index.js";
import { merge, unpatch } from "./lib/index.js";
import { unwrap } from "./lib/unwrap.js";

/**
 * Executes a SyphonX extraction template synchronously against the current DOM.
 *
 * Initializes a {@link Controller} and iterates through `state.actions`, processing
 * only `select` and `transform` action types. Unlike {@link extract}, this function
 * runs synchronously and does not support yielding, browser actions (navigation,
 * clicks, screenshots), or the full action dispatch pipeline. Any error is captured
 * as a `"fatal-error"` in the result.
 *
 * @param state - A partial extraction state containing actions, selectors, variables,
 *   and configuration. Extended with an optional `unwrap` flag that, when `true`,
 *   unwraps singleton arrays in the output data after extraction completes.
 * @returns The extraction state with populated `data`, `errors`, and `metrics`.
 */
export function extractSync(state: Partial<ExtractState> & { unwrap?: boolean }): ExtractState {
    const controller = new Controller(state);

    if (controller.state.unpatch) {
        unpatch(controller.state.unpatch);
        controller.log(`UNPATCHED ${controller.state.unpatch.join(", ")}`);
    }

    try {
        for (const action of controller.state.actions) {
            if (action.hasOwnProperty("select")) {
                const data = controller.select((action as SelectAction).select);
                controller.state.data = merge(controller.state.data, data);
            }
            else if (action.hasOwnProperty("transform")) {
                controller.transform((action as TransformAction).transform);
            }
        }
    }
    catch (err) {
        controller.appendError("fatal-error", err instanceof Error ? err.message : JSON.stringify(err), 0, err instanceof Error ? err.stack : undefined);
    }

    if (state.unwrap)
        controller.state.data = unwrap(controller.state.data);

    return controller.state;
}
