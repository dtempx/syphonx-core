import * as cheerio from "cheerio";
import * as syphonx from "../index.js";
import chalk from "chalk";
import { Metrics } from "../index.js";
import { unwrap as _unwrap } from "./lib.js";
import { Timer } from "../package/lib/index.js";

export interface OfflineOptions {
    actions: syphonx.Action[];
    html: string;
    url?: string;
    params?: Record<string, unknown>;
    debug?: boolean;
    unwrap?: boolean;
}

export async function offline({ html, unwrap = true, ...options }: OfflineOptions): Promise<syphonx.ExtractResult> {
    const timer = new Timer();
    const root = cheerio.load(html);
    const result = await syphonx.extract({ ...options, root, debug: process.env.DEBUG ? true : options.debug } as syphonx.ExtractState);
    if (options.debug || process.env.DEBUG) {
        console.log();
        console.log(chalk.gray(result.log));
    }

    const metrics = result.vars.__metrics as Metrics;
    metrics.elapsed = timer.elapsed();
    metrics.errors = result.errors?.length ?? 0;
    
    const data = unwrap ? _unwrap(result.data) : result.data;
    return {
        ...result,
        ok: result.errors.length === 0,
        status: 0,
        online: false,
        html: root.html(),
        data,
        metrics
    };
}
