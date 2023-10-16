import * as cheerio from "cheerio";
import * as fs from "fs";
import * as syphonx from "../extract/index.js";
import { unwrap } from "../lib/unwrap.js";

export interface SelectOptions {
    file?: string | URL;
    html?: string;
}

export function select(select: syphonx.Select[], { file, html }: SelectOptions): any {
    if (file)
        html = fs.readFileSync(file, "utf8");
    if (!html)
        throw new Error("html not specified");
    const root = cheerio.load(html);
    const result = syphonx.select(select, { root });
    const data = unwrap(result.data);
    return data;
}
