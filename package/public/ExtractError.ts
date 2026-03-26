import { ExtractErrorCode } from "./ExtractErrorCode.js";

/**
 * Represents an error that occurred during extraction.
 *
 * Extract errors are produced by the controller when an error action fires,
 * a required select is missing, an operator is invalid, or an unexpected
 * exception occurs. They are collected in {@link ExtractState.errors} and
 * included in the final {@link ExtractResult}.
 */
export interface ExtractError {
    /** The error code identifying the category of error. */
    code: ExtractErrorCode;

    /** A human-readable description of what went wrong. May contain evaluated template expressions. */
    message: string;

    /**
     * The severity level controlling retry behavior and whether processing stops.
     * - `0` — non-retryable (fatal), processing stops by default.
     * - `1` — retryable, processing continues by default.
     * - `2+` — retryable with higher severity, processing stops by default.
     */
    level: number;

    /**
     * The hierarchical context key identifying where in the extraction tree
     * the error occurred (e.g. `"title"`, `"items.name"`).
     * Built from the current select context stack at the time the error was recorded.
     */
    key?: string;

    /** The stack trace, present when the error originated from a caught exception. */
    stack?: string;
}
