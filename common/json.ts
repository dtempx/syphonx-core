import * as fs from "async-file";
import JSON5 from "json5";

export async function loadJSON(file: string): Promise<any> {
    const text = await fs.readTextFile(file);
    return JSON5.parse(text);
}

export function parseJSON(text: string, strict = true): any {
    if (strict) {
        return JSON5.parse(text);
    } else {
        return new Function(`return ${text}`)();
    }
}

export function tryParseJSON(text: string, strict = true): any {
    try {
        return parseJSON(text, strict);
    } catch (err) {
        return undefined;
    }
}
