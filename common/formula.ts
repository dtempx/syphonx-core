/**
 * Evaluates a Javascript formula within the specified scope returning a computed result.
 * @param formula A Javascript formula to evaluate.
 * @param scope Object state defining the scope of the evaluation.
 * @returns The result of the formula evaluation.
 */
export function evaluateFormula(formula: string, scope: Record<string, unknown> = {}): unknown {
    const keys = Object.keys(scope);
    const values = keys.map(key => scope[key]);
    const fn = new Function(...keys, `return ${formula}`);
    const result = fn(...values);
    return result;
}
