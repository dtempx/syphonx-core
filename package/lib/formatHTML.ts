export function formatHTML(value: unknown): unknown {
    if (typeof value === "string") {
        return value
            .replace(/(<[a-z0-9:._-]+>)[ ]*/gi, "$1") // remove all spaces that immediately follow an opening tag
            .replace(/[ ]*<\//g, "</") // remove all spaces that immediately precede a closing tag
            .trim();
    }
    else if (value instanceof Array && value.every(obj => typeof obj === "string")) {
        return value.map(obj => formatHTML(obj));
    }
    else {
        return value;
    }
}
