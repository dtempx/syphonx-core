export function evaluateFormula(expression: string, args: Record<string, unknown> = {}): unknown {
    const keys = Object.keys(args);
    const values = keys.map(key => args[key]);
    const fn = new Function(...keys, `return ${expression}`);
    const result = fn(...values);
    return result;
}

export function formatHTML(value: unknown): unknown {
    if (typeof value === "string") {
        return value
            .replace(/(<[a-z0-9:._-]+>)[ ]*/gi, "$1") // remove all spaces that immediately follow an opening tag
            .replace(/[ ]*<\//g, "</"); // remove all spaces that immediately precede a closing tag
    }
    else if (value instanceof Array && value.every(obj => typeof obj === "string")) {
        return value.map(obj => formatHTML(obj));
    }
    else {
        return value;
    }
}

export function isObject(obj: unknown): boolean {
    return typeof obj === "object" && obj !== null && !(obj instanceof Array) && !(obj instanceof Date);
}

export function unwrap(obj: unknown): unknown {
    if (obj instanceof Array) {
        return obj.map(item => unwrap(item));
    }
    else if (isObject(obj) && typeof (obj as {}).hasOwnProperty === "function" && (obj as {}).hasOwnProperty("value")) {
        return unwrap((obj as { value: unknown }).value);
    }
    else if (isObject(obj)) {
        const source = obj as Record<string, unknown>;
        const target = {} as Record<string, unknown>;
        for (const key of Object.keys(obj as {})) {
            if (isObject(source[key]) && typeof (source[key] as {}).hasOwnProperty === "function" && (source[key] as {}).hasOwnProperty("value")) {
                target[key] = unwrap((source[key] as { value: unknown }).value); // unwrap value
            }
            else {
                target[key] = unwrap(source![key]);
            }
        }
        return target;
    }
    else {
        return obj;
    }
}
