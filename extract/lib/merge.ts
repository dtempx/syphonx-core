import { isObject } from "./is.js";

export function merge<T = unknown>(source: T, target: T): T {
    if (source instanceof Array && target instanceof Array) {
        return [...source, ...target] as unknown as T;
    }
    else if (isObject(source) && isObject(target)) {
        //return { ...(source as {}), ...(target as {}) } as T;
        const obj = {} as Record<string, unknown>;
        const keys = Array.from(new Set([...Object.keys(source as {}), ...Object.keys(target as {})]));
        for (const key of keys) {
            obj[key] = merge((source as Record<string, unknown>)[key], (target as Record<string, unknown>)[key]);
        }
        return obj as T;
    }
    else if (target) {
        return target;
    }
    else {
        return source;
    }
}
