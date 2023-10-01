import { Controller } from "./controller.js";
import { ExtractState, SelectAction, TransformAction } from "./public/index.js";
import { merge, unpatch } from "./lib/index.js";

export function extractSync(state: Partial<ExtractState>): ExtractState {
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
                const data = controller.transform((action as TransformAction).transform);
            }
        }
    }
    catch (err) {
        controller.appendError("fatal-error", err instanceof Error ? err.message : JSON.stringify(err), 0, err instanceof Error ? err.stack : undefined);
    }

    return controller.state;
}
