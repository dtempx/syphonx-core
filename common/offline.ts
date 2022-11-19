import * as cheerio from "cheerio";
import * as syphonx from "../index.js";
import { removeDOMRefs } from "./utilities.js";

export interface OfflineOptions {
    actions: syphonx.Action[];
    html: string;
    url?: string;
    params?: Record<string, unknown>;
    debug?: boolean;
    includeDOMRefs?: boolean;
}

export async function offline({ html, includeDOMRefs, ...options }: OfflineOptions): Promise<syphonx.ExtractResult> {
    const root = cheerio.load(html);
    const result = await syphonx.extract({ ...options, root, debug: process.env.DEBUG ? true : undefined } as syphonx.ExtractState);
    if (process.env.DEBUG)
        console.log(result.log);
    return {
        ...result,
        ok: result.errors.length === 0,
        status: 0,
        online: false,
        html: root.html(),
        data: includeDOMRefs ? result.data : removeDOMRefs(result.data)
    };
}
