export function parseBoolean(value: unknown): boolean | undefined {
    if (typeof value === "boolean")
        return value;
    else if (typeof value === "string")
        return value !== "" && value.trim().toLowerCase() !== "false" && value.trim() !== "0";
    else
        return undefined;
}

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

export function parseUrl(url: string | undefined): { domain?: string, origin?: string } {
    if (typeof url === "string" && /^https?:\/\//.test(url)) {
        const [protocol, , host] = url.split("/");
        const a = host.split(":")[0].split(".").reverse();
        return {
            domain: a.length >= 3 && a[0].length === 2 && a[1].length === 2 ? `${a[2]}.${a[1]}.${a[0]}` : a.length >= 2 ? `${a[1]}.${a[0]}` : undefined,
            origin: protocol && host ? `${protocol}//${host}` : undefined
        };    
    }
    return {};
}
