export function tryParseJson(value: string): unknown {
    try {
        return JSON.parse(value);
    }
    catch (err) {
        return undefined;
    }
}
