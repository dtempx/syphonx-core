export function collapseWhitespace(text: string, newlines = true): string | null {
    if (typeof text === "string" && text.trim().length === 0) {
        return null;
    }
    else if (typeof text === "string" && newlines) {
        return text
            .replace(/\s*\n\s*/gm, "\n")
            .replace(/\n{2,}/gm, "\n")
            .replace(/\s{2,}/gm, " ")
            .trim();
    }
    else if (typeof text === "string" && !newlines) {
        return text
            .replace(/\n/gm, " ")
            .replace(/\s{2,}/gm, " ")
            .trim();
    }
    else {
        return text;
    }
}
