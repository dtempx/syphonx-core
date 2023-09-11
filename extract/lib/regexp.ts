export function createRegExp(value: unknown): RegExp | undefined {
    if (typeof value === "string" && value.startsWith("/")) {
        const i = value.lastIndexOf("/");
        const pattern = value.substring(1, i);
        const flags = value.length > i ? value.substring(i + 1) : "m";
        return new RegExp(pattern, flags);
    }
}

export function regexpExtract(text: string, regexp: RegExp | string): string | null {
    if (typeof text !== "string")
        return null;
    if (typeof regexp === "string") {
        regexp = createRegExp(regexp)!;
        if (!regexp)
            return null;
    }
    const match = regexp.exec(text);
    if (!match || !match[1])
        return null;
    return match[1];
}

export function regexpExtractAll(text: string, regexp: RegExp | string): string[] | null {
    if (typeof text !== "string")
        return null;
    if (typeof regexp === "string") {
        if (regexp.endsWith("/"))
            regexp += "g";
        regexp = createRegExp(regexp)!;
        if (!regexp)
            return null;
    }
    if (!regexp.global)
        regexp = new RegExp(regexp.source, regexp.flags + "g");
    const matches = Array.from(text.matchAll(regexp) || []);
    const result = [];
    for (const match of matches)
        if (match[1])
            result.push(match[1]);
    return result.length > 0 ? result : null;
}

export function regexpReplace(text: string, regexp: RegExp, replace: string): string {
    if (typeof text === "string")
        return text.replace(regexp, replace);
    else
        return text;
}

export function regexpTest(text: string, pattern: string): boolean | null {
    const negate = pattern.startsWith("!");
    if (negate)
        pattern = pattern.slice(1); // remove negation operator from regexp
    const regexp = createRegExp(pattern);
    if (!regexp)
        return null;
    let result = regexp?.test(text);
    if (result === undefined)
        return null;
    else if (negate)
        return !result;
    else
        return result;
}
