/**
 * A conditional expression that controls whether an action or selection executes.
 *
 * Expressed as a formula string wrapped in curly braces: `"{expression}"`.
 * The expression is evaluated at runtime against the current template variables
 * (`state.vars`) and extracted data. When the expression is falsy, the action
 * is skipped. When `when` is omitted entirely, the action always executes.
 *
 * **Expression syntax:** Standard JavaScript-like expressions evaluated by
 * `evaluateFormula`. Variables are referenced by name (e.g. `{_ok}`) and
 * support operators such as `!`, `===`, template literals, etc. Template
 * variables (names starting with `_`) are stored in `state.vars` and are
 * available in expressions but are not included in the final output data.
 *
 * **Skipped selections:** When a `select` field is skipped because its `when`
 * condition is falsy, its value in the result is `null` (not `undefined`).
 *
 * **Evaluation errors:** If the expression throws, the condition is treated as
 * `false` and the action is skipped.
 *
 * **Logging:** Evaluated conditions are written to the log as
 * `WHEN "{expression}" -> true/false`. A skipped action is logged as `SKIPPED`.
 * An action bypassed because it cannot run in the current mode (e.g. an online-
 * only action running offline) is logged as `BYPASSED`.
 *
 * @example
 * // when/1: #xyz exists so _ok=true → a1 gets "lorum", a2 is null (skipped)
 * // when/2: #xyz missing so _ok=false → a1 is null (skipped), a2 gets "ipsum"
 * { name: "_ok", type: "boolean", query: [["#xyz"]] }
 * { name: "a1",  query: [["#a1"]], when: "{_ok}" }
 * { name: "a2",  query: [["#a2"]], when: "{!_ok}" }
 *
 * @example
 * // when/3: when used inside a nested subselect (object type)
 * {
 *   name: "obj", type: "object", query: [["section"]],
 *   select: [
 *     { name: "_ok", type: "boolean", query: [["#xyz"]] },
 *     { name: "a1", query: [["#a1"]], when: "{_ok}" },
 *     { name: "a2", query: [["#a2"]], when: "{!_ok}" }
 *   ]
 * }
 *
 * @example
 * // errors/3: comparison expression — raise an error only when _h1 matches a value
 * { select: [{ name: "_h1", query: [["h1"]] }] }
 * { error: { when: "{_h1 === 'xyz'}", message: "{`${_h1} error`}", level: 1 } }
 */
export type When = string;
