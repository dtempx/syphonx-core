import { CheerioAPI } from "cheerio";
import { QueryResult } from "../index.js";

export function filterQueryResult($: JQueryStatic & CheerioAPI, result: QueryResult, predicate: (value: unknown, index: number, array: unknown[]) => boolean) {
    if (result.value instanceof Array) {
        const input = {
            elements: result.nodes.toArray(),
            values: result.value
        };
        const output = {
            elements: [] as any[],
            values: [] as unknown[]
        };
        const n = input.elements.length;
        for (let i = 0; i < n; ++i) {
            const hit = predicate(input.values[i], i, input.values);
            if (hit) {
                output.elements.push(input.elements[i]);
                output.values.push(input.values[i]);
            }
        }
        result.nodes = $(output.elements);
        result.value = output.values;
    }
}
