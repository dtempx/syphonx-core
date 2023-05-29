export function parseNumber(value: unknown): number | undefined {
    if (typeof value === "number") {
        return !isNaN(value) ? value : undefined;
    }

    if (typeof value === "string") {
        let [, text] = /([0-9.,]+)/.exec(value) || [];
        if (/\.\d+$/.test(text))
            text = text.replace(/,/g, "");
        if (/,\d+$/.test(text))
            text = text.replace(/\./g, "");
        const result = parseFloat(text);
        return !isNaN(result) ? result : undefined;
    }

    return undefined;
}
