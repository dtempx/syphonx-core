import { Controller } from "./controller.js";
import { ExtractState } from "./public/index.js";
import { unpatch, unwrap } from "./lib/index.js";

/**
 * Executes a SyphonX extraction template against the current DOM.
 *
 * Initializes a {@link Controller} and runs all actions in `state.actions` sequentially.
 * When running inside a browser (online mode), the engine may throw `"YIELD"` to
 * transfer control back to the host for external operations (navigation, clicks,
 * screenshots), after which the host re-enters `extract` to resume execution.
 * A `"STOP"` throw halts extraction early. Any other error is captured as a
 * `"fatal-error"` in the result.
 *
 * @param state - The extraction state containing actions, selectors, variables, and
 *   configuration. Extended with an optional `unwrap` flag that, when `true`, unwraps
 *   singleton arrays in the output data after extraction completes (skipped if yielding).
 * @returns The mutated extraction state with populated `data`, `errors`, and `metrics`.
 */
export async function extract(state: ExtractState & { unwrap?: boolean }): Promise<ExtractState> {
    if (typeof state?.vars?.__instance === "number")
        state.vars.__instance += 1;
    const controller = new Controller(state);
    controller.log(`ENTRY #${controller.state.vars.__instance}${controller.online ? ` ${window.location.href}` : ""}`);
    controller.log(`VARS ${JSON.stringify(controller.state.vars)}`);

    if (controller.state.unpatch) {
        unpatch(controller.state.unpatch);
        controller.log(`UNPATCHED ${controller.state.unpatch.join(", ")}`);
    }

    try {
        await controller.run(controller.state.actions);
        controller.log("EXIT");
    }
    catch (err) {
        if (err === "YIELD") {
            controller.log("YIELDING");
        }
        else if (err === "STOP") {
            controller.log("STOPPED");
        }
        else {
            controller.appendError("fatal-error", err instanceof Error ? err.message : JSON.stringify(err), 0, err instanceof Error ? err.stack : undefined);
        }
    }

    if (controller.online && state.debug)
        window.postMessage({
            direction: "syphonx",
            message: {
                ...controller.state,
                key: "extract-state"
            }
        });

    if (state.unwrap && !state.yield)
        controller.state.data = unwrap(controller.state.data);

    return controller.state;
}
