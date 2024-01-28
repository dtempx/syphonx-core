export function trunc(obj: unknown, max = 80): string {
    if (obj) {
        const text = JSON.stringify(obj);
        if (typeof text === "string")
            return text.length <= max ? text : `${text[0]}${text.slice(1, max)}…${text[text.length - 1]}`;
    }
    return "(empty)";
}
