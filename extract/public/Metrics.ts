/**
 * Returns extraction metrics.
 */
export interface Metrics {
    /** Number of actions in the template. (recursive) */
    actions: number;
    /** Number of clicks that occurred. */
    clicks: number;
    /** Total elapsed run time. (milliseconds) */
    elapsed: number;
    /** Number of errors that occurred. */
    errors: number;
    /** Amount of time spent navigating. (milliseconds) */
    navigate: number;
    /** Count of DOM queries run. */
    queries: number;
    /** Count of renavigations that occurred. */
    renavigations: number;
    /** Count of navigation retries that occurred.  */
    retries: number;
    /** Number of steps skipped. A skip occurs on an unsatisfied `when` condition. */
    skipped: number;
    /** Amount of time spent in a snooze action. (milliseconds) */
    snooze: number;
    /** Number of steps run. */
    steps: number;
    /** Count of timeouts that occurred in a waitfor action.  */
    timeouts: number;
    /** Amount of time spent in a waitfor action. (milliseconds) */
    waitfor: number;
    /** Count of yield actions that occurred. */
    yields: number;
}