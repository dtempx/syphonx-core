export function isAbsoluteUrl(url: string): boolean {
    return url.startsWith("http://") || url.startsWith("https://");
}

export function isEmpty(obj: unknown): boolean {
    if (obj === undefined || obj === null) {
        return true;
    }
    else if (obj instanceof Array) {
        return obj.length === 0;
    }
    else if (typeof obj === "string") {
        return obj.length === 0;
    }
    else {
        return false;
    }
}

export function isFormula(value: unknown): boolean {
    return typeof value === "string" && value.startsWith("{") && value.endsWith("}");
}

export function isRegexp(value: unknown): boolean {
    return typeof value === "string" && (value.startsWith("/") || value.startsWith("!/"));
}

export function isInvocableFrom(obj: unknown, method: string): boolean {
    return obj !== null && typeof obj === "object" && typeof (obj as Record<string, unknown>)[method] === "function";
}

export function isJQueryObject(obj: unknown): boolean {
    return typeof obj === "object" && obj !== null && (!!(obj as { jquery: unknown }).jquery || !!(obj as { cheerio: unknown }).cheerio);
}

export function isObject(obj: unknown): boolean {
    return typeof obj === "object" && obj !== null && !(obj instanceof Array) && !(obj instanceof Date);
}

export function isNullOrUndefined(obj: unknown) {
    return obj === null || obj === undefined;
}
