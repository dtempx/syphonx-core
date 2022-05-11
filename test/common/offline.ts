import * as cheerio from "cheerio";
import * as syphonx from "../../index.js";

export interface OfflineOptions {
    url: string;
    html: string;
    actions: syphonx.Action[];
}

export default async function ({ url, html, actions }: OfflineOptions): Promise<syphonx.ExtractResult> {
    const root = cheerio.load(html);
    const result = await syphonx.extract({ url, actions, root });
    return result;
}
