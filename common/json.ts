import * as fs from "async-file";
import stripJsonComments from "strip-json-comments";

export async function loadJSON(file: string): Promise<any> {
    const text = await fs.readTextFile(file);
    const json = stripJsonComments(text);
    return JSON.parse(json);
}

export function parseJSON(text: string, strict = true): any {
    if (strict) {
        return JSON.parse(text);
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
