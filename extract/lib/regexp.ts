export function createRegExp(value: unknown): RegExp | undefined {
    if (typeof value === "string" && value.startsWith("/")) {
        const i = value.lastIndexOf("/");
        const pattern = value.substring(1, i);
        const flags = value.length > i ? value.substring(i + 1) : "m";
        return new RegExp(pattern, flags);
    }
}

export function regexpExtract(text: string, regexp: RegExp | string, trim = true): string | null {
    if (typeof regexp === "string") {
        regexp = createRegExp(regexp)!;
        if (!regexp) {
            return null;
        }
    }
    const match = regexp.exec(text);
    const result = match ? match[1] : null;
    if (trim && result) {
        return result.trim();
    }
    else {
        return result;
    }
}

export function regexpReplace(text: string, regexp: RegExp, replace: string): string {
    if (typeof text === "string") {
        return text.replace(regexp, replace);
    }
    else {
        return text;
    }
}

export function regexpTest(text: string, pattern: string): boolean | null {
    const negate = pattern.startsWith("!");
    if (negate) {
        pattern = pattern.slice(1); // remove negation operator from regexp
    }
    const regexp = createRegExp(pattern);
    if (!regexp) {
        return null;
    }
    let result = regexp?.test(text);
    if (result === undefined) {
        return null;
    }
    else if (negate) {
        return !result;
    }
    else {
        return result;
    }
}
