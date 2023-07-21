import { ExtractContext } from "./context.js";
import { ExtractState } from "./public/index.js";
import { unpatch } from "./lib/index.js";

export * from "./public/index.js";

export async function extract(state: ExtractState): Promise<ExtractState> {
    if (typeof state?.vars?.__instance === "number") {
        state.vars.__instance += 1;
    }
    const obj = new ExtractContext(state);
    obj.log(`ENTRY #${obj.state.vars.__instance}${obj.online ? ` ${window.location.href}` : ""}`);

    if (obj.state.unpatch) {
        unpatch(obj.state.unpatch);
        obj.log(`UNPATCHED ${obj.state.unpatch.join(", ")}`);
    }

    try {
        await obj.run(obj.state.actions);
        obj.log("EXIT");
    }
    catch (err) {
        if (err === "YIELD") {
            obj.log("YIELDING");
        }
        else if (err === "STOP") {
            obj.log("STOPPED");
        }
        else {
            obj.appendError("fatal-error", err instanceof Error ? err.message : JSON.stringify(err), 0, err instanceof Error ? err.stack : undefined);
        }
    }

    if (obj.online && state.debug)
        window.postMessage({
            direction: "syphonx",
            message: {
                ...obj.state,
                key: "extract-state"
            }
        });

    return obj.state;
}
