import { sleep } from "./index.js";

export interface AttemptOptions {
    retries?: number;
    retryDelay?: number[];
    rethrow?: boolean;
    quiet?: boolean;
}

export interface AttemptResult<T = unknown> {
    result?: T;
    error?: any;
}

export async function attempt<T = unknown>(onTry: () => Promise<T>, onBeforeRetry?: (err: unknown) => boolean, options?: AttemptOptions): Promise<AttemptResult<T>> {
    const {
        retries = 2,
        retryDelay = [1, 10, 30],
        rethrow = true,
        quiet = false
    } = options || {};

    if (!onBeforeRetry)
        onBeforeRetry = () => true;

    let retry = 0;
    while (true) {
        try {
            const result = await onTry();
            return { result };
        }
        catch (error) {
            if (++retry <= retries && onBeforeRetry(error)) {
                if (!quiet)
                    console.warn(`${error instanceof Error ? error.message : JSON.stringify(error)}`);
                const seconds = retryDelay[retry - 1] || retryDelay[retryDelay.length - 1];
                if (!quiet)
                    console.log(`RETRY #${retry}/${retries} sleeping for ${seconds} seconds...`);
                await sleep(seconds * 1000);
            }
            else if (rethrow) {
                throw error;
            }
            else {
                return { error };
            }
        }
    }
}
