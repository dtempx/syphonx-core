import { ltrim, rtrim } from "./trim.js";

export function combineUrl(url: string, path: string): string {
    if (url && path) {
        return `${rtrim(url, "/")}/${ltrim(path, "/")}`;
    }
    else if (url) {
        return url;
    }
    else if (path) {
        return path;
    }
    else {
        return "";
    }
}
