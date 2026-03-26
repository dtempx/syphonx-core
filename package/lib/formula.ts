/**
 * Evaluates a JavaScript expression within the specified scope, returning a computed result.
 *
 * Uses the `Function` constructor to dynamically compile and execute the expression,
 * with each key in `scope` injected as a named parameter accessible within the formula.
 *
 * Formulas in SyphonX templates are denoted by `={...}` syntax (the wrapper is stripped
 * by the caller before this function is invoked). Typical formulas include boolean
 * conditions (`count > 5`, `!done`), computed values (`price * qty`), and template
 * literals (`` `${baseUrl}/page/${id}` ``).
 *
 * @param formula - A JavaScript expression to evaluate (not a statement — must be
 *   usable after `return`).
 * @param scope - An object whose keys become local variable names available to the
 *   formula. Common scope entries include template variables (prefixed with `_`),
 *   extraction state properties (`data`, `params`, `errors`, etc.), and the current
 *   select context (`value`, `index`, `count`).
 * @returns The result of evaluating the expression, which may be any type.
 *
 * @example
 * // Simple arithmetic
 * evaluateFormula("price * qty", { price: 9.99, qty: 3 }); // 29.97
 *
 * @example
 * // Boolean condition used in a When action
 * evaluateFormula("index < count - 1", { index: 2, count: 5 }); // true
 *
 * @example
 * // Template literal for URL construction
 * evaluateFormula("`${baseUrl}/page/${id}`", { baseUrl: "https://example.com", id: 42 });
 * // "https://example.com/page/42"
 */
export function evaluateFormula(formula: string, scope: Record<string, unknown> = {}): unknown {
    const keys = Object.keys(scope);
    const values = keys.map(key => scope[key]);
    const fn = new Function(...keys, `return ${formula}`);
    const result = fn(...values);
    return result;
}
