import * as cheerio from "cheerio";
import * as syphonx from "../index.js";
import { unwrap as _unwrap } from "../lib/unwrap.js";

export interface SelectOptions {
    unwrap?: boolean;
    context?: string;
}

export function select(selects: syphonx.Select[], html: string, { unwrap = true, context }: SelectOptions = {}): syphonx.ExtractState {
    const root = cheerio.load(html);

    const result = syphonx.select(selects, { root, context });
    if (process.env.DEBUG)
        console.log(result.log);

    const data = unwrap ? _unwrap(result.data) : result.data;
    return { ...result, data };
}
