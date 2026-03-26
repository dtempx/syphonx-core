/**
 * A status snapshot sent during extraction to report progress on the current action.
 *
 * Created by the controller at the start of each action step and broadcast via
 * `window.postMessage` in online (browser) mode when `debug` is `true`. The Chrome
 * DevTools extension listens for these messages (keyed by `"extract-status"`) to
 * display real-time step progress to the user.
 */
export interface ExtractStatus {
    /**
     * The current step number within the action list, formatted as a dot-separated
     * path for nested action groups (e.g. `"1"`, `"2.3"`). Set by the controller
     * after `runExtractStatus` returns, before the message is posted.
     */
    step: string;

    /**
     * The total number of steps at the current nesting level, formatted as a
     * dot-separated path matching the depth of `step` (e.g. `"5"`, `"5.3"`).
     * Together with `step`, enables progress display such as "step 2 of 5".
     */
    of: string;

    /**
     * The action type name for the current step (e.g. `"select"`, `"click"`,
     * `"snooze"`, `"navigate"`, `"waitfor"`). Derived from the first key of
     * the action object.
     */
    action: string;

    /**
     * The optional user-defined name of the action, if one was specified in the
     * template. Useful for identifying specific actions in debug output.
     */
    name?: string;

    /**
     * The estimated maximum duration of the action in seconds, when applicable.
     * Computed from the action's configuration:
     * - For `snooze`: the upper bound of the snooze interval.
     * - For `waitfor`: the `timeout` value (defaults to the engine's default timeout).
     * - For `click`: the sum of the snooze upper bound and waitfor timeout, if present.
     */
    timeout?: number;
}
