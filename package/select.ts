import { Controller } from "./controller.js";
import { Action, ExtractState, Select } from "./public/index.js";
import { flattenTemplateSelect } from "./utilities.js";
import { Template } from "../template.js";
import { unwrap } from "./lib/unwrap.js";

/** Options for configuring a {@link select} invocation. */
export interface SelectOptions {
    /** The URL associated with the document, used for resolving relative references. */
    url?: string;
    /** Variables to inject into the extraction state, accessible within selector expressions. */
    vars?: Record<string, unknown>;
    /** Enables debug logging when `true`. */
    debug?: boolean;
    /** A CSS/jQuery selector that sets the root context node for all queries. */
    context?: string;
    /** A pre-existing data object to use as the root of the extraction result. */
    root?: unknown;
    /** When `true`, unwraps singleton arrays in the output data. */
    unwrap?: boolean;
}

/**
 * Evaluates a set of selectors or a template against the current DOM and returns
 * the extracted data.
 *
 * Initializes a {@link Controller} and runs each {@link Select} definition, resolving
 * queries (CSS/jQuery/XPath), values, pivots, and unions. If a {@link Template} is
 * provided instead of a `Select[]` array, its actions are flattened to extract the
 * select definitions. Results are returned as named fields in the extraction state's
 * `data`, or as a single unnamed value for anonymous selects.
 *
 * @param selects - An array of select definitions, or a template whose actions
 *   contain select definitions to be flattened and evaluated.
 * @param options - Optional configuration including `url`, `vars`, `debug`, `context`,
 *   `root`, and an `unwrap` flag that unwraps singleton arrays in the output data.
 * @returns The extraction state with populated `data`, `errors`, and `metrics`.
 * 
 * @example
 * import * as cheerio from 'cheerio';
 * import * as fs from 'fs';
 * import * as syphonx from 'syphonx-core';
 * 
 * const html = fs.readFileSync('./example.html', 'utf-8');
 * const root = cheerio.load(html);
 * const result = syphonx.select(select, { root });
 * const data = syphonx.unwrap(result.data);
 * console.log(JSON.stringify(data, null, 2));
 * 
 */
export function select(selects: Select[] | Template, options: SelectOptions = {}): ExtractState {
    if (!Array.isArray(selects) && typeof selects === "object" && selects !== null && (selects as {}).hasOwnProperty("actions"))
        selects = flattenTemplateSelect((selects as { actions: Action[] }).actions);
    const controller = new Controller(options);
    let data = controller.select(selects as Select[]);
    if (options.unwrap)
        data = unwrap(data);
    return { ...controller.state, data };
}
