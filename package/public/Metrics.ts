/**
 * Performance and diagnostic metrics collected during a template extraction run.
 * Provides insight into how the extraction engine executed, including timing breakdowns,
 * action counts, and error/retry statistics useful for debugging and optimization.
 */
export interface Metrics {
    /** Total number of actions in the template, counted recursively across all nested action groups. */
    actions: number;
    /** Number of click actions that were executed during the extraction run. */
    clicks: number;
    /** Total wall-clock time for the entire extraction run. (milliseconds) */
    elapsed: number;
    /** Total number of errors encountered during extraction, including selector failures and action errors. */
    errors: number;
    /** Cumulative time spent waiting for page navigations to complete. (milliseconds) */
    navigate: number;
    /** Total number of DOM queries (CSS, jQuery, and XPath selectors) executed against the document. */
    queries: number;
    /** Number of times the engine re-navigated to a URL, typically due to a page redirect or reload action. */
    renavigations: number;
    /** Number of navigation retry attempts triggered by failed or incomplete page loads. */
    retries: number;
    /** Number of action steps skipped due to an unsatisfied `when` condition. */
    skipped: number;
    /** Cumulative time spent paused in snooze actions. (milliseconds) */
    snooze: number;
    /** Total number of action steps executed during the extraction run. */
    steps: number;
    /** Number of times a waitfor action exceeded its timeout threshold without the condition being met. */
    timeouts: number;
    /** Cumulative time spent waiting in waitfor actions for a DOM condition to be satisfied. (milliseconds) */
    waitfor: number;
    /** Number of times the engine yielded control back to the host for an external operation (navigate, click, screenshot, etc.). */
    yields: number;
}