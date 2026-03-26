/**
 * Recursively unwraps extracted values by stripping internal wrapper objects.
 * Wrapper objects (those with `value` and `nodes` properties) are replaced by their `value`.
 * Plain objects and arrays are traversed recursively, unwrapping nested values.
 * Primitives and non-unwrappable values are returned as-is.
 */
export function unwrap(obj: unknown): unknown {
    if (isUnwrappable(obj)) {
        return unwrap((obj as { value: unknown }).value);
    }
    else if (isObject(obj)) {
        const source = obj as Record<string, unknown>;
        const target = {} as Record<string, unknown>;
        const keys = Object.keys(obj as {});
        for (const key of keys)
            target[key] = unwrap(source[key])
        return target;
    }
    else if (obj instanceof Array) {
        return obj.map(item => unwrap(item));
    }
    else {
        return obj;
    }
}

function isObject(obj: unknown): boolean {
    return typeof obj === "object" && obj !== null && !(obj instanceof Array) && !(obj instanceof Date);
}

function isUnwrappable(obj: unknown): boolean {
    return isObject(obj) && (obj as {}).hasOwnProperty("value") && (obj as {}).hasOwnProperty("nodes");
}

