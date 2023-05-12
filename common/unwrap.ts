export function unwrap(obj: unknown): unknown {
    if (obj instanceof Array) {
        return obj.map(item => unwrap(item));
    }
    else if (isObject(obj) && (obj as {}).hasOwnProperty("value")) {
        return unwrap((obj as { value: unknown }).value);
    }
    else if (isObject(obj)) {
        const source = obj as Record<string, unknown>;
        const target = {} as Record<string, unknown>;
        for (const key of Object.keys(obj as {})) {
            if (isObject(source[key])) {
                if ((source![key] as { value: unknown }).value !== undefined)
                    target[key] = unwrap((source[key] as { value: unknown }).value); // unwrap value
                else
                    target[key] = null;
            }
            else {
                target[key] = null;
            }
        }
        return target;
    }
    else {
        return obj;
    }
}

function isObject(obj: unknown): boolean {
    return typeof obj === "object" && obj !== null && !(obj instanceof Array) && !(obj instanceof Date);
}

