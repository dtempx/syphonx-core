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
