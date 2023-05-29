export function trim(text: string, pattern: string | RegExp = " "): string {
    return ltrim(rtrim(text, pattern));
}

export function ltrim(text: string, pattern: string | RegExp = " "): string {
    if (typeof text === "string") {
        if (typeof pattern === "string") {
            while (text.startsWith(pattern)) {
                text = text.slice(pattern.length);
            }
        }
        else {
            const hits = pattern.exec(text) || [];
            let hit = hits.find(hit => text.startsWith(hit));
            while (hit) {
                text = text.slice(hit.length);
                hit = hits.find(hit => text.startsWith(hit));
            }
        }
    }
    return text;
}

export function rtrim(text: string, pattern: string | RegExp = " "): string {
    if (typeof text === "string") {
        if (typeof pattern === "string") {
            while (text.endsWith(pattern)) {
                text = text.slice(0, -1 * pattern.length)
            }
        }
        else {
            const hits = pattern.exec(text) || [];
            let hit = hits.find(hit => text.endsWith(hit));
            while (hit) {
                text = text.slice(0, -1 * hit.length);
                hit = hits.find(hit => text.endsWith(hit));
            }
        }
    }
    return text;
}
