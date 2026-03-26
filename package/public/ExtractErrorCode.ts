/**
 * Identifies the type of error that occurred during extraction.
 *
 * - `"app-error"` — A user-defined error from a template `error` action. This is the default error code when no specific code is provided.
 * - `"click-timeout"` — A `click` action's `waitfor` condition was not satisfied within the timeout period.
 * - `"click-required"` — A `click` action with `required: true` found no matching elements for its query selector.
 * - `"error-limit"` — A `repeat` action exceeded its configured error limit across iterations.
 * - `"eval-error"` — A formula evaluation, selector resolution, or operation execution failed. Covers invalid queries, undefined context references, unsupported offline XPath, and failed operator resolution.
 * - `"external-error"` — Reserved for errors originating from external systems.
 * - `"fatal-error"` — An unrecoverable exception during extraction. Produced by the top-level error handler in `extract()` or `extractSync()` when an uncaught error escapes the controller.
 * - `"host-error"` — A host callback operation (goback, locator, reload, screenshot, or yield) failed. These errors originate from the host environment rather than the extraction engine.
 * - `"invalid-select"` — A `select` definition has an invalid structure, such as missing a required `query`, `union`, or `value`, or a `waitfor` select that is not internal, boolean, and non-repeated.
 * - `"invalid-operator"` — An unsupported or unrecognized jQuery operator was used in a selector chain.
 * - `"invalid-operand"` — An operator received an invalid argument, such as a malformed regex, failed type coercion, or too many parameters.
 * - `"select-required"` — A `select` with `required: true` resolved to an empty or null value.
 * - `"waitfor-timeout"` — A `waitfor` action's query or select condition was not satisfied within the timeout period.
 */
export type ExtractErrorCode =
      "app-error"
    | "click-timeout"
    | "click-required"
    | "error-limit"
    | "eval-error"
    | "external-error"
    | "fatal-error"
    | "host-error"
    | "invalid-select"
    | "invalid-operator"
    | "invalid-operand"
    | "select-required"
    | "waitfor-timeout";
