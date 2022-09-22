import { CheerioAPI } from "cheerio";

export interface Break {
    when?: When;
    active?: boolean;
}

export interface Click {
    $: SelectQuery[];
    waitfor?: WaitFor; // skip if no nodes selected
    snooze?: SnoozeInterval;
    required?: boolean;
    retry?: number;
    when?: When;
    active?: boolean;
}

export interface Repeat {
    actions: Action[];
    limit?: number; // max # of repitions (default=100)
    errors?: number; // error limit (default=1)
}

export interface SelectTarget {
    $?: SelectQuery[];
    pivot?: SelectTarget;
    select?: Select[];
    value?: unknown;
    all?: boolean; // includes all $ hits instead of just the first hit (default=false)
        // if values are arrays then results are merged
        // if values are strings then results are concatenated with newlines
        // if values are booleans then results are and'ed together
        // otherwise the latest result takes precedence
    hits?: number | null; // limits the number of query hits, default is unlimited or specify null for unlimited
    limit?: number | null; // limits the number of nodes returned by the query, when repeated is false and all is false then default=1 otherwise default is unlimited, specify null to force unlimited nodes
    format?: SelectFormat; // default is multiline when type=string, whitespace is added for multiline and singleline, none is the same as text(), innertext and textcontent only work online
    pattern?: string; // validation pattern (only applies if type=string)
    collate?: boolean; // collate nodes to single result
    when?: When; // SKIPPED actions indicate an unmet when condition, BYPASSED actions indicate unexecuted actions in offline mode
    active?: boolean;
}

export interface Select extends SelectTarget {
    name?: string; // if not defined then value is projected
    repeated?: boolean; // if repeated is true then an array is returned, othewise if type is string then strings will be newline concatenated otherwise if type is boolean then all values are and'ed otherwise the first value is taken, default is false
    required?: boolean; // indicates whether an error should result if no value selected, default is false
    type?: SelectType; // default is "string" except when there is a sub-select in which case default is "object"
    union?: SelectTarget[];
}

export interface Transform {
    $: SelectQuery;
    when?: When;
    active?: boolean;
}

export interface WaitFor {
    $?: SelectQuery[];
    select?: Select[];
    timeout?: number;
    on?: WaitForOn;
    pattern?: string; // waits for a specific text pattern if specified
    required?: boolean; // indicates whether processing should stop with an error on timeout
    when?: When;
    active?: boolean;
}

export interface Yield {
    when?: When;
    timeout?: number;
    active?: boolean;
}

export type SelectType = "string" | "number" | "boolean" | "object";
export type SelectQuery = [string, ...SelectQueryOp[]];
export type SelectQueryOp = [string, ...unknown[]];
export type SelectQueryOperator = string;
export type SelectQueryOperand = unknown;
export type SelectFormat = "href" | "multiline" | "singleline" | "innertext" | "textcontent" | "none";
export type WaitForOn = "any" | "all" | "none";

export interface SelectContext {
    name: string;
    nodes: JQueryResult;
    value: unknown;
    parent?: SelectContext;
}

export type Snooze = [number, number];

export type BreakAction = { break: Break };
export type ClickAction = { click: Click };
export type RepeatAction = { repeat: Repeat };
export type SelectAction = { select: Select[] };
export type SnoozeAction = { snooze: Snooze };
export type TransformAction = { transform: Transform[] };
export type WaitForAction = { waitfor: WaitFor };
export type YieldAction = { yield: Yield };

export type Action = BreakAction | ClickAction | RepeatAction | SelectAction | SnoozeAction | TransformAction | WaitForAction | YieldAction;

export interface QueryParams {
    $?: SelectQuery[];
    type?: SelectType;
    repeated?: boolean;
    all?: boolean;
    format?: SelectFormat;
    pattern?: string;
    limit?: number | null;
    hits?: number | null;
}

export interface QueryResult {
    nodes: JQueryResult;
    value: unknown;
    valid?: boolean;
}

export type JQueryResult = JQuery<any>;
export type JQueryDelegate = Record<string, (...args: unknown[]) => JQuery<HTMLElement>>;

export type When = string;
export type SnoozeMode = "before" | "after" | "before-and-after"; // default=before
export type SnoozeInterval = [number, number] | [number, number, SnoozeMode]; //seconds

interface ResolveQueryParams {
    query: SelectQuery;
    type: SelectType;
    repeated: boolean;
    all: boolean;
    limit: number | null | undefined;
    format?: SelectFormat;
    pattern?: string;
    context?: SelectContext;
    result?: QueryResult;
}

interface ResolveQueryOpsParams {
    ops: SelectQueryOp[];
    nodes: JQueryResult;
    value: unknown;
    type: SelectType;
    repeated: boolean;
    all: boolean;
    limit?: number | null;
    format?: SelectFormat;
    pattern?: string;
}

interface DataItem {
    nodes: number[];
    value: unknown;
}

type DispatchResult = "break" | "yield" | "timeout" | "required" | null;

export interface YieldResult {
    step: number;
    timeout?: number;
}

export interface ExtractState {
    actions: Action[];
    url: string;
    domain: string;
    origin: string;
    params: Record<string, unknown>;
    vars: Record<string, unknown>;
    data: any;
    log: string;
    errors: ExtractError[];
    debug: boolean;
    yield?: YieldResult;
    root?: unknown;
}

export interface ExtractResult extends Omit<ExtractState, "yield" | "root"> {
    ok: boolean;
    status: number;
    online: boolean;
    html: string;
}

export interface ExtractError {
    code: ExtractErrorCode;
    message: string;
    key?: string;
}

export type ExtractErrorCode = 
    "click-timeout" |
    "click-required" |
    "error-limit" |
    "eval-error" |
    "fatal-error" |
    "invalid-select" |
    "invalid-operator" |
    "invalid-operand" |
    "select-required" |
    "waitfor-timeout";

export async function extract(state: ExtractState): Promise<ExtractState> {

    function collapseWhitespace(text: string, newlines = true): string | null {
        if (typeof text === "string" && text.trim().length === 0) {
            return null;
        }
        else if (typeof text === "string" && newlines) {
            return text
                .replace(/\s*\n\s*/gm, "\n")
                .replace(/\n{2,}/gm, "\n")
                .replace(/\s{2,}/gm, " ")
                .trim();
        }
        else if (typeof text === "string" && !newlines) {
            return text
                .replace(/\n/gm, " ")
                .replace(/\s{2,}/gm, " ")
                .trim();
        }
        else {
            return text;
        }
    }

    function coerceValue(value: unknown, type: SelectType): unknown {
        if (type === "string") {
            return typeof value === "string" ? value : typeof value === "number" || typeof value === "boolean" ? value.toString() : null;
        }
        else if (type === "number") {
            return typeof value === "number" ? value : typeof value === "string" ? parseNumber(value) : null;
        }
        else if (type === "boolean") {
            return typeof value === "boolean" ? value : typeof value === "string" ? value.trim().length > 0 : null;
        }
        else {
            return null;
        }    
    }

    function combineUrl(url: string, path: string): string {
        if (url && path) {
            return `${rtrim(url, "/")}/${ltrim(path, "/")}`;
        }
        else if (url) {
            return url;
        }
        else if (path) {
            return path;
        }
        else {
            return "";
        }
    }

    function createRegExp(value: unknown): RegExp | undefined {
        if (typeof value === "string" && value.startsWith("/")) {
            const i = value.lastIndexOf("/");
            const pattern = value.substring(1, i);
            const flags = value.length > i ? value.substring(i + 1) : "m";
            return new RegExp(pattern, flags);
        }
    }

    function cut(text: string, splitter: string, n: number, limit?: number): string | null {
        if (typeof text === "string") {
            const a = text
                .split(splitter, limit)
                .map(value => value.trim())
                .filter(value => value.length > 0);
            const i = n >= 0 ? n : a.length + n;
            return i >= 0 && i < a.length ? a[i] : null;
        }
        else {
            return null;
        }
    }

    function evaluateFormula(expression: string, args: Record<string, unknown> = {}): unknown {
        const keys = Object.keys(args);
        const values = keys.map(key => args[key]);
        const fn = new Function(...keys, `return ${expression}`);
        const result = fn(...values);
        return result;
    }

    function formatStringValue(value: string, format: SelectFormat, origin: string): unknown {
        if (format === "href" && typeof value === "string" && origin && !isAbsoluteUrl(value)) {
            return combineUrl(origin, value);
        }
        else if (format === "multiline") {
            return collapseWhitespace(value, true);
        }
        else if (format === "singleline") {
            return collapseWhitespace(value, false);
        }
        else if (format === "none") {
            return value;
        }
        else {
            return value;
        }
    }

    function isAbsoluteUrl(url: string): boolean {
        return url.startsWith("http://") || url.startsWith("https://");
    }

    function isEmpty(obj: unknown): boolean {
        if (obj === undefined || obj === null) {
            return true;
        }
        else if (obj instanceof Array) {
            return obj.length === 0;
        }
        else if (typeof obj === "string") {
            return obj.length === 0;
        }
        else {
            return false;
        }
    }

    function isFormula(value: unknown): boolean {
        return typeof value === "string" && value.startsWith("{") && value.endsWith("}");
    }

    function isRegexp(value: unknown): boolean {
        return typeof value === "string" && (value.startsWith("/") || value.startsWith("!/"));
    }

    function isInvocableFrom(obj: unknown, method: string): boolean {
        return obj !== null && typeof obj === "object" && typeof (obj as Record<string, unknown>)[method] === "function";
    }

    function isJQueryObject(obj: unknown): boolean {
        return typeof obj === "object" && obj !== null && (!!(obj as { jquery: unknown }).jquery || !!(obj as { cheerio: unknown }).cheerio);
    }

    function isObject(obj: unknown): boolean {
        return typeof obj === "object" && obj !== null && !(obj instanceof Array) && !(obj instanceof Date);
    }

    function isNullOrUndefined(obj: unknown) {
        return obj === null || obj === undefined;
    }

    function merge<T = unknown>(source: T, target: T): T {
        if (source instanceof Array && target instanceof Array) {
            return [...source, ...target] as unknown as T;
        }
        else if (isObject(source) && isObject(target)) {
            //return { ...(source as {}), ...(target as {}) } as T;
            const obj = {} as Record<string, unknown>;
            const keys = Array.from(new Set([...Object.keys(source as {}), ...Object.keys(target as {})]));
            for (const key of keys) {
                obj[key] = merge((source  as Record<string, unknown>)[key], (target as Record<string, unknown>)[key]);
            }
            return obj as T;
        }
        else if (target) {
            return target;
        }
        else {
            return source;
        }
    }

    function parseNumber(value: unknown): number | undefined {
        if (typeof value === "number") {
            return !isNaN(value) ? value : undefined;
        }
    
        if (typeof value === "string") {
            let [, text] = /([0-9.,]+)/.exec(value) || [];
            if (/\.\d+$/.test(text))
                text = text.replace(/,/g, "");
            if (/,\d+$/.test(text))
                text = text.replace(/\./g, "");
            const result = parseFloat(text);
            return !isNaN(result) ? result : undefined;
        }

        return undefined;
    }
    
    function parseUrl(url: string): { domain?: string, origin?: string } {
        if (/^https?:\/\//.test(url)) {
            const [protocol, , host] = url.split("/");
            const a = host.split(":")[0].split(".").reverse();
            return {
                domain: a.length >= 3 && a[0].length === 2 && a[1].length === 2 ? `${a[2]}.${a[1]}.${a[0]}` : a.length >= 2 ? `${a[1]}.${a[0]}` : undefined,
                origin: protocol && host ? `${protocol}//${host}` : undefined
            };    
        }
        return {};
    }
    
    function regexpExtract(text: string, regexp: RegExp | string): string | null {
        if (typeof regexp === "string") {
            regexp = createRegExp(regexp)!;
            if (!regexp) {
                return null;
            }
        }
        const match = regexp.exec(text);
        return match ? match[1] : null;
    }

    function regexpReplace(text: string, regexp: RegExp, replace: string): string {
        if (typeof text === "string") {
            return text.replace(regexp, replace);
        }
        else {
            return text;
        }
    }

    function regexpTest(text: string, pattern: string): boolean | null {
        const negate = pattern.startsWith("!");
        if (negate) {
            pattern = pattern.slice(1); // remove negation operator from regexp
        }
        const regexp = createRegExp(pattern);
        if (!regexp) {
            return null;
        }
        let result = regexp?.test(text);
        if (result === undefined) {
            return null;
        }
        else if (negate) {
            return !result;
        }
        else {
            return result;
        }
    }

    function removeDOMRefs(obj: unknown): unknown {
        if (obj instanceof Array) {
            return obj.map(item => removeDOMRefs(item));
        }
        else if (isObject(obj) && typeof (obj as {}).hasOwnProperty === "function" && (obj as {}).hasOwnProperty("value")) {
            return removeDOMRefs((obj as { value: unknown }).value);
        }
        else if (isObject(obj)) {
            const source = obj as Record<string, unknown>;
            const target = {} as Record<string, unknown>;
            for (const key of Object.keys(obj as {})) {
                if (isObject(source[key]) && typeof (source[key] as {}).hasOwnProperty === "function" && (source[key] as {}).hasOwnProperty("value")) {
                    target[key] = removeDOMRefs((source[key] as { value: unknown }).value); // unwrap value
                }
                else {
                    target[key] = removeDOMRefs(source![key]);
                }
            }
            return target;
        }
        else {
            return obj;
        }
    }

    function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function trim(text: string, pattern: string | RegExp = " "): string {
        return ltrim(rtrim(text, pattern));
    }

    function ltrim(text: string, pattern: string | RegExp = " "): string {
        if (typeof text === "string") {
            if (typeof pattern === "string") {
                while (text.startsWith(pattern)) {
                    text = text.slice(pattern.length);
                }
            }
            else {
                const hits = pattern.exec(text) || [];
                let hit = hits.find(hit => text.startsWith(hit));
                while (hit) {
                    text = text.slice(hit.length);
                    hit = hits.find(hit => text.startsWith(hit));
                }
            }
        }
        return text;
    }

    function rtrim(text: string, pattern: string | RegExp = " "): string {
        if (typeof text === "string") {
            if (typeof pattern === "string") {
                while (text.endsWith(pattern)) {
                    text = text.slice(0, -1 * pattern.length)
                }
            }
            else {
                const hits = pattern.exec(text) || [];
                let hit = hits.find(hit => text.endsWith(hit));
                while (hit) {
                    text = text.slice(0, -1 * hit.length);
                    hit = hits.find(hit => text.endsWith(hit));
                }
            }
        }
        return text;
    }

    function trunc(obj: unknown, max = 80): string {
        const text = JSON.stringify(obj);
        if (typeof text === "string")
            return text.length <= max ? text : `${text[0]}${text.slice(1, max)}…${text[text.length - 1]}`;
        else
            return "";
    }

    function typeName(obj: unknown): string {
        if (obj === null)
            return "null";
        else if (obj === undefined)
            return "undefined";
        else if (typeof obj === "string")
            return "string"
        else if (typeof obj === "number")
            return "number";
        else if (obj instanceof Array)
            return obj.length > 0 ? `Array<${Array.from(new Set(obj.map(value => typeName(value)))).join("|")}>` : "[]";
        else if (obj instanceof Date)
            return "date";
        else if (typeof obj === "object")
            return "object";
        else
            return "unknown";
    }

    function $scrollToBottom(): Promise<void> {
        return new Promise(resolve => {
            let totalHeight = 0;
            const timer = setInterval(() => {
                window.scrollBy(0, window.innerHeight);
                totalHeight += window.innerHeight;
                if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    }

    function $statement(query: SelectQuery): string {
        const valid = query instanceof Array && query.length > 0 && typeof query[0] === "string" && query.slice(1).every(op => op instanceof Array);
        if (!valid) {
            return `INVALID: ${JSON.stringify(query)}`;
        }
        const selector = query[0];
        const ops = query.slice(1) as SelectQueryOp[];
        return [`$("${selector}")`, ...ops.map(op => `${op[0]}(${op.slice(1).map(param => JSON.stringify(param)).join(", ")})`)].join(".");
    }

    function $statements($: SelectQuery[] | undefined): string {
        if ($ && $.length > 0)
            return `${$statement($[0])}${$.length > 1 ? ` (+${$.length - 1} more))` : ""}`;
        else
            return "(none)";
    }

    class ExtractContext {
        jquery: JQueryStatic & CheerioAPI;
        state: ExtractState;
        online: boolean;
        //context: SelectContext; // todo: move the select context from a param passed down thru query
    
        constructor(state: ExtractState) {
            this.jquery = (state.root as JQueryStatic & CheerioAPI) || $;
            this.online = typeof this.jquery.noConflict === "function";

            state.params = state.params || {};
            state.vars = state.vars || { _iteration: 0 };
            state.errors = state.errors || [];
            state.debug = state.debug || false;
            state.log = state.log || "";

            if (this.online) {
                state.url = window.location.href;
            }
            const { domain, origin } = parseUrl(state.url);
            state.domain = domain || "";
            state.origin = origin || "";

            this.state = state;
        }

        private break({ active, when }: Break): boolean {
            if (this.online && (active ?? true)) {
                if (this.when(when, "BREAK")) {
                    this.log(`BREAK ${when}`);
                    return true;
                }
                else {
                    this.log(`BREAK SKIPPED ${when}`);
                }
            }
            else {
                this.log(`BREAK BYPASSED ${when}`);
            }
            return false;
        }

        private async click({ $, waitfor, snooze, required, retry, active, when }: Click): Promise<"timeout" | "not-found" | null> {
            if (this.online && (active ?? true)) {
                if (this.when(when, "CLICK")) {
                    const mode = snooze ? snooze[2] || "before" : undefined;
                    if (snooze && (mode === "before" || mode === "before-and-after")) {
                        const seconds = snooze[0];
                        this.log(`CLICK SNOOZE BEFORE (${seconds}s) ${$statements($)}`);
                        await sleep(seconds * 1000);
                    }
                    const result = this.query({ $ });
                    if (result && result.nodes.length > 0) {
                        this.log(`CLICK ${$statements($)}`);
                        const [node] = result.nodes;
                        node.click();
                        if (waitfor) {
                            const code = await this.waitfor(waitfor, "CLICK");
                            if (!code) {
                                if (snooze && (mode === "after" || mode === "before-and-after")) {
                                    const seconds = snooze[0];
                                    this.log(`CLICK SNOOZE AFTER (${seconds}s) ${$statements($)}`);
                                    await sleep(seconds * 1000);
                                }
                            }
                            else if (code === "timeout") {
                                this.error("click-timeout", `Timeout waiting for click result. ${trunc(waitfor.$)}${waitfor.pattern ? `, pattern=${waitfor.pattern}` : ""}`);
                                return "timeout";
                            }
                            else if (code === "invalid") {
                                // error already recorded, do nothing more
                            }
                        }
                    }
                    else {
                        if (required) {
                            this.error("click-required", `Required click target not found. ${trunc($)}`);
                        }
                        return "not-found";
                    }
                }
                else {
                    this.log(`CLICK SKIPPED ${$statements($)}`);
                }
            }
            else {
                this.log(`CLICK BYPASSED ${$statements($)}`);
            }
            return null;
        }

        private async dispatch(action: Action, step: number): Promise<DispatchResult> {
            if (action.hasOwnProperty("select")) {
                const data = this.select((action as SelectAction).select);
                this.state.data = merge(this.state.data, data);
            }
            else if (action.hasOwnProperty("break")) {
                if (this.break((action as BreakAction).break)) {
                    return "break";
                }
            }
            else if (action.hasOwnProperty("click")) {
                const required = (action as ClickAction).click.required;
                const code = await this.click((action as ClickAction).click);
                if (code === "timeout" && required) {
                    return "timeout";
                }
                else if (code === "not-found" && required) {
                    return "required";
                }
            }
            else if (action.hasOwnProperty("repeat")) {
                await this.repeat((action as RepeatAction).repeat);
            }
            else if (action.hasOwnProperty("snooze")) {
                await this.snooze((action as SnoozeAction).snooze);
            }
            else if (action.hasOwnProperty("transform")) {
                await this.transform((action as TransformAction).transform);
            }
            else if (action.hasOwnProperty("waitfor")) {
                const required = (action as WaitForAction).waitfor.required;
                const code = await this.waitfor((action as WaitForAction).waitfor);
                if (code === "timeout" && required) {
                    return "timeout";
                }
            }
            else if (action.hasOwnProperty("yield")) {
                const y = this.yield((action as YieldAction).yield || {});
                if (y) {
                    this.state.yield = {
                        step: step + 1,
                        timeout: y.timeout
                    };
                    return "yield";
                }
            }
            return null;
        }

        each({ nodes, value }: QueryResult, callback: (node: JQuery, param: unknown) => void) {
            if (nodes) {
                const elements = nodes.toArray();
                for (let i = 0; i < elements.length; ++i) {
                    const node = this.jquery(elements[i]);
                    const subvalue = value instanceof Array ? value[i] : value;
                    callback(node, subvalue);
                }
            }
        }

        error(code: ExtractErrorCode, message: string, key?: string): void {
            this.state.errors.push({ code, message, key });
            this.log(`ERROR (${code}): ${message}`);
        }

        private evaluate(input: unknown, params: Record<string, unknown> = {}): unknown {
            if (isFormula(input)) {
                const { data, ...extra } = params;
                const args = {
                    ...this.state.vars,
                    ...this.state,
                    data: removeDOMRefs(merge(this.state.data, data)),
                    ...extra
                } as Record<string, unknown>;

                try {
                    const result = evaluateFormula((input as string).slice(1, -1).trim(), args);
                    return result;
                }
                catch (err) {
                    this.error("eval-error", `Error evaluating formula "${input}": ${err instanceof Error ? err.message : JSON.stringify(err)}`); // todo: populate key with this.context.path
                    throw new Error("Error evaluating formula");
                }
            }
            else if (isRegexp(input)) {
                const result = regexpExtract(params.value as string, input as string);
                return result;
            }
            else {
                return input;
            }
        }

        private evaluateBoolean(input: unknown, params: Record<string, unknown> = {}): boolean | null {
            if (isRegexp(input)) {
                const result = regexpTest(params.value as string, input as string);
                return result;
            }
            else {
                const result = this.evaluate(input, params);
                return typeof result === "boolean" ? result : null;
            }
        }

        async execute(actions: Action[]): Promise<void> {
            const resumeStep = this.state.yield?.step || 0;
            if (this.state.yield) {
                this.log(`YIELD SKIPPING TO STEP #${this.state.yield.step}`);
                this.state.yield = undefined;
            }
            for (const action of actions) {
                const step = actions.indexOf(action) + 1;
                if (step >= resumeStep) {
                    this.log(`STEP #${step}/${actions.length}`);
                    this.state.vars._step = step;
                    const code = await this.dispatch(action, step);
                    if (code) {
                        this.log(`BREAK AT STEP #${step}/${actions.length}, code=${code}`);
                        return;
                    }
                }
            }
            this.log(`${actions.length} steps completed`);
        }
        
        private formatResult(result: QueryResult, type: SelectType, all: boolean, limit: number | null | undefined, format: SelectFormat = "multiline", pattern: string | undefined): QueryResult {
            const regexp = createRegExp(pattern);

            // apply limit for repeated result
            if (limit !== undefined && limit !== null && result.value instanceof Array) {
                result.nodes = this.jquery(result.nodes.toArray().slice(0, limit));
                result.value = result.value.slice(0, limit);
            }

            if (type === "string" && result.value instanceof Array) {
                result.value = result.value.map(value => formatStringValue(coerceValue(value, "string") as string, format, this.state.origin));
                if (regexp && !isEmpty(result.value)) {
                    result.valid = (result.value as string[]).every(value => regexp.test(value));
                }
            }
            else if (type === "string") {
                result.value = formatStringValue(coerceValue(result.value, "string") as string, format, this.state.origin);
                if (regexp && !isEmpty(result.value)) {
                    result.valid = regexp.test(result.value as string);
                }
            }
            else if (type === "boolean" && result.value instanceof Array && result.value.length === 0) {
                result.value = false;
            }
            else if (type === "boolean" && result.value instanceof Array && all) {
                result.value = result.value.every(value => coerceValue(value, "boolean") === true); // and all booleans together
            }
            else if (type === "boolean" && result.value instanceof Array && !all) {
                result.value = result.value.some(value => coerceValue(value, "boolean") === true); // or all booleans together
            }
            else if (type === "boolean") {
                result.value = coerceValue(result.value, "boolean");
            }
            else if (type === "number" && result.value instanceof Array) {
                result.value = result.value.map(value => coerceValue(value, "number"));
            }
            else if (type === "number") {
                result.value = coerceValue(result.value, "number");
            }
    
            return result;
        }

        private keypath(name: string | undefined, context: SelectContext | undefined): string {
            return context ? `${context.name}.${name || "."}` : `${name || ""}`;
        }

        log(text: string): void {
            if (this.state.debug) {
                this.state.log += text + "\n";
            }
        }

        private mergeQueryResult(source: QueryResult | undefined, target: QueryResult | undefined): QueryResult | undefined {
            if (source && target) {
                const nodes = source.nodes && target.nodes ? this.jquery([...source.nodes.toArray(), ...target.nodes.toArray()]) : target.nodes || source.nodes;
                let value = undefined;
                if (source.value instanceof Array && target.value instanceof Array) {
                    value = [...source.value, ...target.value];
                }
                else if (source.value instanceof Array && !isNullOrUndefined(target.value)) {
                    value = [...source.value, target.value];
                }
                else if (target.value instanceof Array && !isNullOrUndefined(source.value)) {
                    value = [source.value, ...target.value];
                }
                else if (!isNullOrUndefined(source.value) && !isNullOrUndefined(target.value)) {
                    value = [source.value, target.value];
                }
                else {
                    value = target.value ?? source.value;
                }
                return { nodes, value, valid: target.valid ?? source.valid };
            }
            else if (target) {
                return target;
            }
            else {
                return source;
            }
        }

        private query({ $, type = "string", repeated = false, all = false, format, pattern, limit, hits }: QueryParams, context?: SelectContext): QueryResult | undefined {
            if ($ instanceof Array && $.every(query => query instanceof Array) && $[0].length > 0 && !!$[0][0]) {
                if (limit === undefined && type === "string" && !repeated && !all) {
                    limit = 1;
                }
                if (hits === null || hits === undefined) {
                    hits = $.length;
                }
                this.log(`QUERY ${$statements($)}`); // todo: log this.context.path when available
                let hit = 0;
                let result: QueryResult | undefined = undefined;
                for (const query of $) {
                    const subresult = this.resolveQuery({ query, type, repeated, all, limit, format, pattern, context, result });
                    if (subresult) {
                        result = this.mergeQueryResult(result, subresult);
                        this.log(`QUERY #${$.indexOf(query) + 1}/${$.length} ${$statement(query)} -> ${trunc(subresult.value)} (${subresult.nodes.length} nodes) ${subresult !== result ? ` (merged ${result!.nodes.length} nodes)` : ""}${pattern ? `, pattern=${pattern}, hit=${hit}, valid=${subresult.valid}` : ""}`);
                        if (subresult.nodes.length > 0) {
                            if (!all) {
                                this.log(`QUERY #${$.indexOf(query) + 1}/${$.length} STOP (first hit)`);
                                break;
                            }
                            if (++hit === hits) {
                                this.log(`QUERY #${$.indexOf(query) + 1}/${$.length} STOP (${hits} hits)`);
                                break;
                            }
                        }
                    }
                    else {
                        this.log(`QUERY #${$.indexOf(query) + 1}/${$.length} ${$statement(query)} -> (none)${pattern ? `, pattern=${pattern}` : ""}`);
                    }
                }

                if (result) {
                    if (repeated && !(result.value instanceof Array)) {
                        result.value = [result.value];
                    }
                    else if (!repeated && result.value instanceof Array && type === "string") {
                        result.value = result.value.length > 0 ? result.value.join(format === "singleline" ? " " : "\n") : null; // concatenate strings
                    }
                    else if (!repeated && result.value instanceof Array) {
                        result.value = result.value[0]; // take first value
                    }
                    return result;
                }
            }
        }

        private async repeat({ actions, limit = 100, errors = 1 }: Repeat): Promise<void> {
            let errorCount = 0;
            let baselineErrorCount = this.state.errors.length;
            let i = 0;
            let code = undefined;
            while (i < limit) {
                this.log(`REPEAT #${++i} (limit=${limit})`);
                this.state.vars._page = i;
                for (const action of actions) {
                    const step = actions.indexOf(action) + 1;
                    code = await this.dispatch(action, step);
                    if (code) {
                        this.log(`REPEAT #${i} -> break at step ${step}/${actions.length}, code=${code}`);
                        break;
                    }
                }
                if (!code) {
                    this.log(`REPEAT #${i} -> ${actions.length} steps completed`);
                    errorCount = this.state.errors.length - baselineErrorCount;
                    if (errorCount >= errors) {
                        this.error("error-limit", `${errorCount} errors in repeat (error ${errors} limit exceeded)`);
                        break;
                    }
                }
                else {
                    break;
                }
            }
            this.log(`REPEAT ${i} iterations completed (limit=${limit}, errors=${errorCount}/${errors})`);
        }

        private resolveOperands(operands: unknown[], result: QueryResult): void {
            for (let i = 0; i < operands.length; ++i) {
                if (isFormula(operands[i]) || isRegexp(operands[i])) {
                    this.each(result, (node, value) => {
                        const resolvedValue = String(this.evaluate(operands[i], { value }));
                        if (resolvedValue !== operands[i]) {
                            operands[i] = resolvedValue;
                        }
                    });
                }
            }
        }

        private resolveQuery({ query, type, repeated, all, limit, format, pattern, context, result }: ResolveQueryParams): QueryResult | undefined {
            let selector = query[0];
            const ops = query.slice(1) as SelectQueryOp[];

            let nodes: JQueryResult;
            let value: unknown;
            if (selector === "." && context) {
                nodes = this.jquery(context.nodes);
                value = context.value;
            }
            else if (selector === ".." && context?.parent) {
                nodes = this.jquery(context.parent.nodes);
                value = context.parent.value;
            }
            else if (selector === "{window}") {
                nodes = this.online ? this.jquery(window) : this.jquery();
                value = null;
            }
            else if (selector === "{document}") {
                nodes = this.online ? this.jquery(document) : this.jquery();
                value = null;
            }
            else {
                try {
                    selector = String(this.evaluate(selector));
                    nodes = this.resolveQueryNodes(this.jquery(selector, context?.nodes), result?.nodes);
                    value = this.text(nodes, format);
                }
                catch (err) {
                    this.error("eval-error", `Failed to resolve selector for "${$statement(query)}": ${err instanceof Error ? err.message : JSON.stringify(err)}`);
                    return undefined;
                }
            }

            if (ops.length > 0 && nodes.length > 0) {
                try {
                    return this.resolveQueryOps({ ops, nodes, type, repeated, all, limit, format, pattern, value });
                }
                catch (err) {
                    this.error("eval-error", `Failed to resolve operation for "${$statement(query)}": ${err instanceof Error ? err.message : JSON.stringify(err)}`);
                    return undefined;
                }
            }
            else if (type === "boolean") {
                // if type is boolean then result is based on whether the query resulted in any hits
                return {
                    nodes,
                    value: !repeated ? nodes.length > 0 : [nodes.length > 0]
                }
            }
            else if (nodes.length > 0) {
                return this.formatResult({ nodes, value }, type, all, limit, format, pattern);
            }
            else {
                return undefined;
            }
        }

        private resolveQueryNodes(target: JQueryResult, result: JQueryResult | undefined) {
            if (result) {
                const source = result.toArray();
                const nodes = target.toArray().filter(node => !source.includes(node));
                return this.jquery(nodes);
            }
            else {
                return target;
            }
        }

        private resolveQueryOps({ ops, nodes, type, repeated, all, limit, format, pattern, value }: ResolveQueryOpsParams): QueryResult {
            const result: QueryResult = { nodes, value };

            const valid = ops instanceof Array && ops.every(op => op instanceof Array && op.length > 0 && typeof op[0] === "string");
            if (!valid) {
                this.error("invalid-operator", `INVALID: ${JSON.stringify(ops)}`);
                return result;
            }
    
            const a = ops.slice(0);
            while (a.length > 0) {
                const [operator, ...operands] = a.shift()!;
                if (operator === "blank") {
                    result.nodes = this.jquery(result.nodes.toArray().filter(element => this.jquery(element).text().trim().length === 0));
                    result.value = this.text(result.nodes, format);
                }
                else if (operator === "cut") {
                    if (!this.validateOperands(operator, operands, ["string", "number"], ["number"])) {
                        break;
                    }
                    const splitter = operands[0] as string;
                    const n = operands[1] as number;
                    const limit = operands[2] as number | undefined;
                    if (typeof result.value === "string") {
                        result.value = cut(result.value, splitter, n, limit);
                    }
                    else if (result.value instanceof Array && result.value.every(value => typeof value === "string")) {
                        result.value = result.value.map(value => cut(value, splitter, n, limit));
                    }
                    else {
                        result.value = null;
                    }
                }
                else if (operator === "extract") {
                    if (!this.validateOperands(operator, operands, ["string"], ["boolean"])) {
                        break;
                    }
                    const regexp = createRegExp(operands[0]);
                    const keepUnmatchedItems = operands[1] as boolean;
                    if (!regexp) {
                        this.error("invalid-operand", `Invalid regular expression for "extract"`);
                    }
                    else if (result.value instanceof Array && result.value.every(value => typeof value === "string")) {
                        const values = result.value.map(value => regexpExtract(value.trim(), regexp));
                        if (!keepUnmatchedItems) {
                            const elements = result.nodes.toArray();
                            for (let i = result.value.length - 1; i >= 0; --i) {
                                if (values[i] === null) {
                                    elements.splice(i, 1);
                                    values.splice(i, 1);
                                }
                            }
                            result.nodes = this.jquery(elements);
                        }
                        result.value = values;
                    }
                    else if (typeof result.value === "string") {
                        result.value = regexpExtract(result.value.trim(), regexp);
                    }
                    else {
                        result.value = null;
                    }
                    //todo: log
                }
                else if (operator === "filter" && (isFormula(operands[0]) || isRegexp(operands[0]))) {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        break;
                    }
                    const input = {
                        elements: result.nodes.toArray(),
                        values: result.value instanceof Array ? result.value : new Array(result.nodes.length).fill(result.value)
                    };
                    const output = {
                        elements: [] as any[],
                        values: [] as unknown[]
                    };
                    const n = input.elements.length;
                    for (let i = 0; i < n; ++i) {
                        const hit = this.evaluateBoolean(operands[0], { value: input.values[i], index: i, count: n });
                            if (hit === true) {
                            output.elements.push(input.elements[i]);
                            output.values.push(input.values[i]);
                        }
                    }
                    result.nodes = this.jquery(output.elements);
                    result.value = output.values;
                }
                else if (operator === "html" && (operands[0] === "outer" || operands[0] === undefined)) {
                    if (this.online) {
                        result.value = result.nodes.toArray().map(element => element.outerHTML.trim());
                    }
                    else {
                        result.value = result.nodes.toArray().map(element => this.jquery.html(element).toString().trim());
                    }
                }
                else if (operator === "html" && operands[0] === "inner") {
                    result.value = result.nodes.toArray().map(element => this.jquery(element).html());
                    //result.value = result.nodes.html().trim();
                }
                else if (operator === "map") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        break;
                    }
                    const input = {
                        elements: result.nodes.toArray(),
                        values: result.value instanceof Array ? result.value : new Array(result.nodes.length).fill(result.value)
                    };
                    const output = {
                        elements: [] as any[],
                        values: [] as unknown[]
                    };
                    const n = input.elements.length;
                    for (let i = 0; i < n; ++i) {
                        const value = this.evaluate(operands[0], { value: input.values[i], index: i, count: n });
                        if (value !== null && value !== undefined) {
                            output.elements.push(input.elements[i]);
                            output.values.push(value);
                        }
                    }
                    result.nodes = this.jquery(output.elements);
                    result.value = output.values;
                }
                else if (operator === "nonblank") {
                    result.nodes = this.jquery(result.nodes.toArray().filter(element => this.jquery(element).text().trim().length > 0));
                    result.value = this.text(result.nodes, format);
                }
                else if (operator === "replace") {
                    if (!this.validateOperands(operator, operands, ["string", "string"])) {
                        break;
                    }
                    const regexp = createRegExp(operands[0]);
                    if (!regexp) {
                        this.error("invalid-operand", `Invalid regular expression for "replace"`);
                    }
                    else if (result.value instanceof Array && result.value.every(value => typeof value === "string")) {
                        result.value = result.value.map(value => regexpReplace(value, regexp, operands[1] as string));
                    }
                    else if (typeof result.value === "string") {
                        result.value = regexpReplace(result.value, regexp, operands[1] as string);
                    }
                    //todo: log
                }
                else if (operator === "replaceHTML") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        break;
                    }
                    this.each(result, (node, value) => {
                        const content = String(this.evaluate(operands[0], { value }));
                        node.html(content);
                    });
                    result.value = null;
                }
                else if (operator === "replaceText") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        break;
                    }
                    this.each(result, (node, value) => {
                        const content = String(this.evaluate(operands[0], { value }));
                        node.text(content);
                    });
                    result.value = null;
                }
                else if (operator === "replaceWith") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        break;
                    }
                    this.each(result, (node, value) => {
                        const content = String(this.evaluate(operands[0], { value }));
                        node.replaceWith(content);
                    });
                    result.value = null;
                }
                else if (operator === "reverse") {
                    if (!this.validateOperands(operator, operands, [], [])) {
                        break;
                    }
                    result.nodes = this.jquery(result.nodes.toArray().reverse());
                    result.value = this.text(result.nodes, format);
                }
                else if (operator === "scrollBottom") {
                    if (this.online) {
                        const y = result.nodes.scrollTop()! + result.nodes.height()!;
                        this.log(`scrollBottom ${result.nodes.scrollTop()} ${result.nodes.height()} ${y}`)
                        window.scrollTo(0, y);
                    }
                }
                else if (operator === "split") {
                    const bypass = operands[0] === undefined && result.value instanceof Array;
                    if (!bypass) {
                        const text = result.value instanceof Array ? result.value.join("\n") : result.value as string;
                        const separator = operands[0] as string;
                        const limit = typeof operands[1] === "number" ? operands[1] as number : undefined;
                        const trim = typeof operands[2] === "boolean" ? operands[2] as boolean : true;
                        //todo: support regexp
                        result.value = text.split(separator, limit);
                        if (trim && result.value instanceof Array) {
                            result.value = result.value.map(value => value.trim()).filter(value => value.length > 0);
                        }
                    }
                }
                else if (operator === "text" && operands[0] === "inline") {
                    result.value = result.nodes.toArray().map((element: Element) => 
                        Array.from(element.childNodes)
                            .filter(node => node.nodeType === 3) // 3 is a TEXT_NODE
                            .map(node => node.textContent ?? (node as any).data) // dom has node.textContent, cheerio has node.data
                            .join(" ")
                            .trim()
                            .replace(/[ ]{2,}/, " ")
                    );
                }
                //else if (operator === "trimAll") {
                    //todo: implement trimAll
                //}
                else if (["appendTo", "each", "prependTo", "insertBefore", "insertAfter", "replaceAll"].includes(operator)) {
                    this.error("invalid-operator", `Operator "${operator}" not supported`);
                    this.break;
                }
                // invoke any function within JQuery<T> that matches operator
                else if (isInvocableFrom(result.nodes, operator)) {
                    this.resolveOperands(operands, result);
                    const delegate = result.nodes as unknown as JQueryDelegate;
                    const obj = delegate[operator](...operands);
                    if (isJQueryObject(obj)) {
                        result.nodes = obj;
                        result.value = this.text(result.nodes, format);
                    }
                    else if (repeated) {
                        result.value = result.nodes.toArray().map(element => {
                            const delegate = this.jquery(element) as unknown as JQueryDelegate;
                            const obj = delegate[operator](...operands);
                            return obj;
                        });
                    }
                    else {
                        result.value = obj;
                    }
                }
                else {
                    this.error("invalid-operator", `Operator '${operator}' not found`);
                    break;
                }
            }
            return this.formatResult(result, type, all, limit, format, pattern);
        }

        private select(selects: Select[], context?: SelectContext): unknown {
            const data = {} as Record<string, DataItem | null>;
            for (const select of selects) {
                if (select.active ?? true) {
                    let item: DataItem | null = null;
                    if (this.when(select.when)) {
                        if (select.pivot) {
                            item = this.selectResolvePivot(select, item, context);
                        }
                        else if (select.union) {
                            item = this.selectResolveUnion(select, item, context, data);
                        }
                        else if (select.$) {
                            item = this.selectResolve(select, item, context);
                        }
                        else if (select.value) {
                            item = this.selectResolveValue(select, data);
                            /*
                            const obj = {
                                data: merge(this.data, data),
                                params: this.params,
                                ...this.state.vars,
                                ...this.state
                            };
                            const value = coerceValue(expandTokens(select.value, obj), select.type || "string");
                            item = {
                                nodes: [],
                                value: select.repeated ? [value] : value
                            };
                            */
                        }
                    }
    
                    if (isEmpty(item?.value) && select.required) {
                        //todo: add path when this.context.path is available
                        this.error("select-required", `Required select '${context?.name ? `${context.name}.${select.name}` : select.name}' not found`, select.name);
                    }
    
                    if (select.name?.startsWith("_") && item) {
                        this.state.vars[select.name] = item.value;
                    }
                    else if (select.name) {
                        data[select.name] = item;
                    }
                    else {
                        return item;
                    }
                }
            }
            return data;
        }

        private selectResolve(select: Select, item: DataItem | null, context: SelectContext | undefined): DataItem | null {
            let subitem: DataItem | null = null;
            if (select.type === undefined) {
                select.type = select.select ? "object" : "string";
            }
            const result = this.query(select, context);
            if (result) {
                if (select.type !== "object") {
                    subitem = {
                        nodes: [], // todo: translate result.nodes nodes to ids
                        value: result.value
                    };
                }
                else if (select.select) {
                    const n = result.value instanceof Array ? result.value.length : 0;
                    if (select.repeated && result.nodes.length === n && !select.collate) {
                        // select by nodes
                        subitem = {
                            nodes: [], // todo: translate result.nodes nodes to ids
                            value: result.nodes.toArray().map((node, i) => {
                                const subcontext = {
                                    name: context?.name ? `${context.name}.${select.name}[${i}]` : `${select.name}[${i}]`,
                                    nodes: this.jquery(node),
                                    value: result.value instanceof Array ? result.value[i] : result.value,
                                    parent: context
                                };
                                return this.select(select.select!, subcontext);
                            })
                        };
                    }
                    else if (select.repeated && result.value instanceof Array && !select.collate) {
                        // select by values (this is common when using split)
                        subitem = {
                            nodes: [], // todo: translate result.nodes nodes to ids
                            value: result.value.map((value, i) => {
                                const subcontext = {
                                    name: context?.name ? `${context.name}.${select.name}[${i}]` : `${select.name}[${i}]`,
                                    //nodes: this.jquery(result.nodes[0]),
                                    nodes: result.nodes,
                                    value,
                                    parent: context
                                };
                                return this.select(select.select!, subcontext);
                            })
                        };
                    }
                    else {
                        const subcontext = {
                            name: context?.name ? `${context.name}.${select.name}` : select.name!,
                            //nodes: this.jquery(result.nodes[0]),
                            nodes: result.nodes,
                            value: result.value,
                            parent: context
                        };
                        // if collate is true force all to true for each subselect so all node values are included with each subselect
                        const subselect = select.collate ? select.select.map(obj => ({ ...obj, all: true })) : select.select;
                        const value = this.select(subselect, subcontext);
                        subitem = {
                            nodes: [], // todo: translate result.nodes nodes to ids
                            value: select.repeated ? [value] : value
                        };
                    }
                }
            }
            this.log(`SELECT ${this.keypath(select.name, context)} -> ${$statements(select.$)} -> ${subitem ? trunc(subitem.value) : "(none)"}${item ? ` merge(${typeName(item?.value)}, ${typeName(subitem?.value)})` : ""}`);
            return merge(item, subitem);
        }

        private selectResolvePivot(select: Select, item: DataItem | null, context: SelectContext | undefined): DataItem | null {
            const { pivot, ...superselect } = select;
            if (pivot) {
                const result = this.query(select, context);
                if (result && result.nodes && result.nodes.length > 0) {
                    const parent: SelectContext = {
                        name: context?.name ? `${context.name}.${select.name}` : select.name!,
                        nodes: result.nodes,
                        value: result.value,
                        parent: context
                    };
                    const elements = result.nodes.toArray();
                    for (const element of elements) {
                        const i = elements.indexOf(element);
                        const nodes = this.jquery(element);
                        const value = this.text(nodes, select.format);
                        const subcontext = {
                            name: context?.name ? `${context.name}.${select.name}[${i}]` : `${select.name}[${i}]`,
                            nodes,
                            value,
                            parent
                        };
                        item = this.selectResolve({ ...superselect, ...pivot }, item, subcontext);
                        this.log(`PIVOT ${subcontext.name} -> ${typeName(item?.value)}`);
                    }
                }
                else {
                    this.log(`PIVOT ${this.keypath(select.name, context)} EMPTY`);
                }
            }
            return item;
        }

        private selectResolveUnion(select: Select, item: DataItem | null, context: SelectContext | undefined, data: unknown): DataItem | null {
            const { union, ...superselect } = select;
            if (union) {
                for (const subselect of union) {
                    if (subselect.active ?? true) {
                        if (this.when(subselect.when)) {
                            this.log(`UNION ${this.keypath(select.name, context)} ${union.indexOf(subselect) + 1}/${union.length}`);
                            if (subselect.pivot) {
                                item = this.selectResolvePivot({ ...superselect, ...subselect }, item, context);
                            }
                            else if (subselect.$) {
                                item = this.selectResolve({ ...superselect, ...subselect }, item, context);
                            }
                            else if (subselect.value) {
                                item = this.selectResolveValue(subselect);
                            }
                            /*
                            if (!subselect.pivot) {
                                item = this.selectResolve({ ...superselect, ...subselect }, item, context);
                            }
                            else {
                                item = this.selectResolvePivot({ ...superselect, ...subselect }, item, context);
                            }
                            */
                        }
                        else {
                            this.log(`UNION SKIPPED ${this.keypath(select.name, context)} ${union.indexOf(subselect) + 1}/${union.length}`);
                        }
                    }
                    else {
                        this.log(`UNION BYPASSED ${this.keypath(select.name, context)} ${union.indexOf(subselect) + 1}/${union.length}`);
                    }
                }
            }
            return item;
        }

        private selectResolveValue(select: Select, data?: Record<string, DataItem | null>): DataItem {
            const result = this.evaluate(select.value, { data });
            const value = coerceValue(result, select.type || "string");
            return {
                nodes: [],
                value: select.repeated ? [value] : value
            };
        }

        private async snooze(interval: Snooze): Promise<void> {
            this.log(`SNOOZE ${interval[0]}s`);
            await sleep(interval[0] * 1000);
        }

        private text(nodes: JQuery<HTMLElement>, format: SelectFormat | undefined): string[] {
            format = format?.toLowerCase() as SelectFormat;
            if (this.online && format === "innertext") {
                return nodes.toArray().map(element => element.innerText);
            }
            else if (this.online && format === "textcontent") {
                return nodes.toArray().map(element => element.textContent as string);
            }
            else if (format === "none") {
                return nodes.toArray().map(element => this.jquery(element).text());
            }
            else {
                // add whitespace after nodes https://stackoverflow.com/questions/32635444/alternative-to-jquery-text-that-includes-spaces-between-elements
                // a<i>b</i>c -> a b c 
                nodes.find("*").each((index, element) => {
                    const node = this.jquery(element);
                    const tag = node.prop("tagName").toLowerCase();
                    const whitespace = tag === "br" || tag === "p" ? "\n" : " ";
                    node.append(whitespace);
                    if (index === 0) {
                        node.prepend(" ");
                    }
                });
                return nodes.toArray().map(element => this.jquery(element).text().trim().replace(/[ ]{2,}/g, " "));
            }
        }

        private async transform(transforms: Transform[]): Promise<void> {
            for (const transform of transforms) {
                if (transform.active ?? true) {
                    if (this.when(transform.when, "TRANSFORM")) {
                        const query = transform.$;
                        const selector = query[0];
                        const ops = query.slice(1) as SelectQueryOp[];
                        if (selector === "{window}" && ops[0][0] === "scrollBottom") {
                            this.log(`TRANSFORM ${$statement(query)}`);
                            await $scrollToBottom();
                        }
                        else {
                            try {
                                const result = this.resolveQuery({ query, type: "string", repeated: true, all: true, limit: null });
                                this.log(`TRANSFORM ${$statement(query)} -> (${result?.nodes?.length || 0} nodes)`);
                            }
                            catch (err) {
                                this.log(`TRANSFORM ERROR ${$statement(query)}: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
                            }
                        }
                    }
                    else {
                        this.log(`TRANSFORM SKIPPED ${$statement(transform.$)}`);
                    }
                }
                else {
                    this.log(`TRANSFORM BYPASSED ${$statement(transform.$)}`);
                }    
            }
        }

        private validateOperands(operator: SelectQueryOperator, operands: SelectQueryOperand[], required: Array<"string" | "number" | "boolean">, optional: Array<"string" | "number" | "boolean"> = []): boolean {
            for (let i = 0; i < required.length; ++i) {
                if (typeof operands[i] !== required[i]) {
                    this.error("invalid-operand", `Operand #${i + 1} of "${operator}" is invalid: "${operands[i]}" is not a ${required[i]}`);
                    return false;
                }
            }
            for (let i = 0; i < optional.length; ++i) {
                const j = i + required.length;
                //if (!isNullOrUndefined(operands[j]) && typeof operands[j] !== optional[i]) {
                if (operands[j] !== undefined && operands[j] !== null && typeof operands[j] !== optional[i]) {
                    this.error("invalid-operand", `Operand #${j + 1} of "${operator}" is invalid: "${operands[j]}" is not a ${optional[i]}`);
                    return false;
                }
            }
            return true;
        }

        private async waitfor({ $, select, timeout, on = "any", required, pattern, when, active }: WaitFor, context?: string): Promise<"timeout" | "invalid" | null> {
            if (this.online && (active ?? true)) {
                if (this.when(when, "WAITFOR")) {
                    if (timeout === undefined) {
                        timeout = 30;
                    }
                    else if (timeout === null || timeout <= 0) {
                        timeout = Infinity;
                    }
        
                    let code = null;
                    if ($) {
                        this.log(`${context ? `${context} ` : ""}WAITFOR QUERY ${trunc($)} on=${on}, timeout=${timeout}, pattern=${pattern}`);
                        code = await this.waitforQuery($, on, timeout, required, pattern, context);
                    }
                    else if (select) {
                        this.log(`${context ? `${context} ` : ""}WAITFOR SELECT ${trunc(select)} on=${on}, timeout=${timeout}, pattern=${pattern}`);
                        code = await this.waitforSelect(select, on, timeout, required, pattern, context);
                    }
                    return code;
                }
                else {
                    this.log(`${context ? `${context} ` : ""}WAITFOR BYPASSSED ${$statements($)}`);
                    return null;
                }
            }
            else {
                this.log(`${context ? `${context} ` : ""}WAITFOR SKIPPED ${$statements($)}`);
                return null;
            }
        }

        private async waitforQuery($: SelectQuery[], on: WaitForOn, timeout: number, required: boolean | undefined, pattern: string | undefined, context: string | undefined): Promise<"timeout" | null> {
            const t0 = new Date().valueOf();
            let elapsed = 0;
            let pass = false;
            let result = undefined;
            while (!pass && elapsed < timeout) {
                const type = pattern ? "string": "boolean";
                const all = on === "all";
                result = this.query({ $, type, pattern, all, repeated: all });
                if (result) {
                    if (type === "boolean") {
                        if (on === "any") {
                            pass = result.value === true;
                        }
                        else if (on === "all") {
                            pass = (result.value as boolean[]).every(value => value === true);
                        }
                        else if (on === "none") {
                            pass = result.value === false;
                        }
                    }
                    else if (type === "string") {
                        if (on === "any") {
                            pass = !isEmpty(trim(result.value as string)) && result.valid !== false;
                        }
                        else if (on === "all") {
                            pass = (result.value as string[]).every(value => !isEmpty(trim(value))) && result.valid !== false;
                        }
                        else if (on === "none") {
                            pass = !(!isEmpty(trim(result.value as string)) && result.valid !== false);
                        }
                    }
                }
                if (!pass) {
                    await sleep(100);
                }
                elapsed = (new Date().valueOf() - t0) / 1000;
            }

            const message = `${context ? `${context} ` : ""}WAITFOR QUERY ${$statements($)} -> ${trunc(result?.value)}${pattern ? ` (valid=${result?.valid})` : ""} -> on=${on} -> ${pass} (${elapsed}s${elapsed > timeout ? " TIMEOUT": ""})`;
            this.log(message);
            if (pass) {
                return null;
            }
            else if (required) {
                this.error("waitfor-timeout", message);
                return "timeout";
            }
            else {
                return null;
            }
        }

        private async waitforSelect(selects: Select[], on: WaitForOn, timeout: number, required: boolean | undefined, pattern: string | undefined, context: string | undefined): Promise<"timeout" | "invalid" | null> {
            for (const select of selects) {
                if (!select.name || !select.name.startsWith("_") || !(!select.type || select.type === "boolean") || select.repeated) {
                    this.error("invalid-select", "waitfor select must all be internal, boolean, and not repeated");
                    return "invalid";
                }
            }
            const t0 = new Date().valueOf();
            let elapsed = 0;
            let state: Record<string, unknown> = {};
            let pass = false;
            while (!pass && elapsed < timeout) {
                state = {};
                let n = 0;
                for (const select of selects) {
                    const type = pattern ? "string": "boolean";
                    const all = on === "all";
                    const result = this.query({ ...select, type, pattern, all });
                    if (result && result.valid !== false) {
                        state[select.name!] = result.value;
                        this.state.vars[select.name!] = result.value;
                        if (result.value) {
                            n += 1;
                        }
                    }
                }

                if (on === "any") {
                    pass = n > 0;
                }
                else if (on === "all") {
                    pass = n === selects.length;
                }
                else if (on === "none") {
                    pass = n === 0;
                }
                else {
                    pass = n > 0;
                }

                if (!pass) {
                    await sleep(100);
                }
                elapsed = (new Date().valueOf() - t0) / 1000;
            }

            const message = `${context ? `${context} ` : ""}WAITFOR SELECT ${JSON.stringify(state)}${pattern ? "valid=???" : ""} -> on=${on} -> ${pass} (${elapsed}s${elapsed > timeout ? " TIMEOUT": ""})`;
            this.log(message);
            if (pass) {
                return null;
            }
            else if (required) {
                this.error("waitfor-timeout", message);
                return "timeout";
            }
            else {
                return null;
            }
        }

        private when(when: When | undefined, context?: string): boolean {
            if (when) {
                try {
                    const result = !!this.evaluate(when);
                    this.log(`${context ? `${context} ` : ""}WHEN ${JSON.stringify(when)} -> ${result}`);
                    return result;
                }
                catch (err) {
                    this.log(`${context ? `${context} ` : ""}WHEN ${JSON.stringify(when)} -> ERROR ${err instanceof Error ? err.message : JSON.stringify(err)}`);
                    return false;
                }
            }
            return true;
        }

        private yield({ active, when, timeout }: Yield): { timeout?: number } | undefined {
            if (this.online && (active ?? true)) {
                if (this.when(when, "YIELD")) {
                    this.log(`YIELD ${when || "(default)"} -> timeout=${timeout || "(default)"}`);
                    return { timeout };
                }
                else {
                    this.log(`YIELD SKIPPED ${when}`);
                }
            }
            else {
                this.log(`YIELD BYPASSED ${when}`);
            }
            return undefined;
        }
    }

    const obj = new ExtractContext(state);
    (obj.state.vars._iteration as number) += 1;
    obj.log(`ITERATION #${obj.state.vars._iteration}${obj.online ? ` ${window.location.href}` : ""}`);

    try {
        await obj.execute(obj.state.actions);
    }
    catch (err) {
        obj.error("fatal-error", err instanceof Error ? `${err.message}\n${err.stack}` : JSON.stringify(err));
    }
    return obj.state;
}
