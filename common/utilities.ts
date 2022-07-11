export function isObject(obj: unknown): boolean {
    return typeof obj === "object" && obj !== null && !(obj instanceof Array) && !(obj instanceof Date);
}

export function removeDOMRefs(obj: unknown): unknown {
    if (obj instanceof Array) {
        return obj.map(item => removeDOMRefs(item));
    }
    else if (isObject(obj) && typeof (obj as {}).hasOwnProperty === "function" && (obj as {}).hasOwnProperty("value")) {
        return removeDOMRefs((obj as { value: unknown }).value);
    }
    else if (isObject(obj)) {
        const source = obj as Record<string, unknown>;
        const target = {} as Record<string, unknown>;
        for (const key of Object.keys(obj as {})) {
            if (isObject(source[key]) && typeof (source[key] as {}).hasOwnProperty === "function" && (source[key] as {}).hasOwnProperty("value")) {
                target[key] = removeDOMRefs((source[key] as { value: unknown }).value); // unwrap value
            }
            else {
                target[key] = removeDOMRefs(source![key]);
            }
        }
        return target;
    }
    else {
        return obj;
    }
}
