export function cut(text: string, splitter: string, n: number, limit?: number): string | null {
    if (typeof text === "string") {
        const a = text
            .split(splitter, limit)
            .map(value => value.trim())
            .filter(value => value.length > 0);
        const i = n >= 0 ? n : a.length + n;
        return i >= 0 && i < a.length ? a[i] : null;
    }
    else {
        return null;
    }
}
