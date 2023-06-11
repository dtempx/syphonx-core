export function unwind(obj: {}) {
    const [key] = Object.keys(obj);
    if (key.includes(".")) {
        const value = (obj as Record<string, unknown>)[key];
        const keys = key.split(".");
        obj = {};
        let p = obj as Record<string, unknown>;
        for (const k of keys) {
            const lastOne = keys.indexOf(k) === keys.length - 1;
            if (!lastOne) {
                p[k] = {};
                p = p[k] as Record<string, unknown>;
            }
            else {
                p[k] = value;
            }
        }
    }
    return obj;
}
