import { CheerioAPI, Node as CheerioNode } from "cheerio";

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

export interface Do {
    $: SelectQuery[];
    when?: When;
    active?: boolean;
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
    limit?: number | null; // default=1 when repeated is false and all is false, set to null to override
    format?: SelectFormat; // default is multiline when type=string, whitespace is added for multiline and singleline, none is the same as text(), innertext and textcontent only work online
    pattern?: string; // validation pattern (only applies if type=string)
    collate?: boolean; // collate nodes to single result
    when?: When;
    active?: boolean;
}

export interface Select extends SelectTarget {
    name?: string; // if not defined then value is projected
    repeated?: boolean; // if repeated is true then an array is returned, othewise if type is string then strings will be newline concatenated otherwise if type is boolean then all values are and'ed otherwise the first value is taken, default is false
    required?: boolean; // default is false
    type?: SelectType; // default is "string" except when there is a sub-select in which case default is "object"
    union?: SelectTarget[];
}

export interface WaitFor {
    $?: SelectQuery[];
    select?: Select[];
    timeout?: number;
    on?: WaitForOn;
    pattern?: string; // waits for a specific text pattern if specified
    when?: When;
    active?: boolean;
}

/*
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - consider operation to be finished when there are no network connections for at least 500 ms.
*/
export declare type YieldWaitFor = "load" | "domcontentloaded" | "networkidle";

export interface Yield {
    when?: When;
    waitfor?: YieldWaitFor;
    active?: boolean;
}

export type SelectType = "string" | "number" | "boolean" | "object";
export type SelectQuery = [string, SelectQueryOp?];
export type SelectQueryOp = [SelectQueryOperator, SelectQueryOperand?, SelectQueryOperand?, SelectQueryOperand?];
export type SelectQueryOperator = string;
export type SelectQueryOperand = string | number | boolean | undefined;
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
export type DoAction = { do: Do };
export type RepeatAction = { repeat: Action[] };
export type SelectAction = { select: Select[] };
export type SnoozeAction = { snooze: Snooze };
export type WaitForAction = { waitfor: WaitFor };
export type YieldAction = { yield: Yield };

export type Action = BreakAction | ClickAction | DoAction | RepeatAction | SelectAction | SnoozeAction | WaitForAction | YieldAction;

export interface QueryParams {
    $?: SelectQuery[];
    type?: SelectType;
    repeated?: boolean;
    all?: boolean;
    format?: SelectFormat;
    pattern?: string;
    limit?: number | null;
}

export interface QueryResult {
    nodes: JQueryResult;
    value: unknown;
    valid?: boolean;
}

export interface ExtractOptions {
    actions: Action[];
    url?: string;
    params?: Record<string, unknown>;
    state?: Record<string, unknown>; // new
    step?: number; // new
    root?: unknown;
    nodes?: boolean; // deprecated
    debug?: boolean;
}

export interface ExtractState {
    [key: string]: unknown;
    url: string;
    domain: string;
    origin: string;
    params: Record<string, unknown>;
    data: any;
    log: string[]; // SKIPPED actions indicate an unmet when condition, BYPASSED actions indicate unexecuted actions in offline mode
    errors: ExtractError[];
    debug: boolean;
    yield?: YieldResult;
}

export interface ExtractResult extends Omit<ExtractState, "log"> {
    ok: boolean;
    online: boolean;
    log?: string;
    data: any; // deprecated
}

export interface ExtractError {
    code: ExtractErrorCode;
    message: string;
}

export type ExtractErrorCode = 
    "click-timeout" |
    "click-required" |
    "invalid-select" |
    "invalid-operator" |
    "invalid-operand" |
    "select-required" |
    "unknown-error";

export type JQueryResult = JQuery<any>;
export type JQueryDelegate = Record<string, (...args: unknown[]) => JQuery<HTMLElement>>;

export type When = "string";
export type SnoozeMode = "before" | "after" | "before-and-after"; // default=before
export type SnoozeInterval = [number, number] | [number, number, SnoozeMode]; //seconds

interface QueryResolveParams {
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

interface DispatchResult {
    break?: boolean;
    yield?: boolean;
}

export interface YieldResult {
    step: number;
    waitfor: YieldWaitFor;
}

const defaultState = {
    params: {},
    log: [],
    errors: []
};

export async function extract({ actions, url, state, step, root, params, debug = false, nodes = false }: ExtractOptions): Promise<ExtractResult> {

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
        return `${rtrim(url, "/")}/${ltrim(path, "/")}`;
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

    function expandTokens(input: unknown, obj: Record<string, unknown>, encode = false): unknown {
        if (typeof input === "string") {
            let result = input;
            const tokens = Array.from(new Set(input.match(/{[a-z0-9._]+}/g) || []));
            for (const token of tokens) {
                let value = resolveProperty(obj, token.slice(1, -1));
                if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                    // substitute token with primitive value
                    result = result.replace(
                        new RegExp(token, "gi"),
                        encode ? encodeURIComponent(value.toString()) : value.toString(),
                    );
                }
                else if (value === null) {
                    return null; // if any value is null then entire result is null
                }
                else {
                    result = result.replace(new RegExp(token, "gi"), ""); // substitute token with a blank value
                }
            }
            result = result.replace(/\{\{/g, "{").replace(/\}\}/g, "}"); // replace escaped double-curly braces
            return result;
        }
        else {
            return input;
        }
    }

    function formatStringValue(value: string, format: SelectFormat, origin: string): unknown {
        if (format === "href" && typeof value === "string" && origin) {
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
            const keys = Array.from(new Set([...Object.keys(source), ...Object.keys(target)]));
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
    
    function parseUrl(url: string): Partial<{ domain: string, origin: string }> {
        const [protocol, , host] = url.split("/");
        const a = host.split(":")[0].split(".").reverse();
        return {
            domain: a.length >= 3 && a[0].length === 2 && a[1].length === 2 ? `${a[2]}.${a[1]}.${a[0]}` : a.length >= 2 ? `${a[1]}.${a[0]}` : undefined,
            origin: protocol && host ? `${protocol}//${host}` : undefined
        };
    }
    
    function regexpExtract(text: string, regexp: RegExp): string | null {
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

    function resolveProperty(dictionary: Record<string, any>, key: string): any {
        if (typeof key === "string") {
            return key
                .split(".")
                .reduce(
                    (result, prop) => (typeof result === "object" && result !== null ? result[prop] : undefined),
                    dictionary,
                );
        }
    }

    function resolveQueryStringValue(value: unknown, delegate: (text: string) => string): unknown {
        let result = null;
        if (typeof value === "string") {
            result = delegate(value);
        }
        else if (value instanceof Array && value.every(value => typeof value === "string")) {
            result = value.map(value => delegate(value));
        }
        return result;
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

    function trunc(obj: unknown, max = 40): string {
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

    function unwrapValue(obj: unknown): unknown {
        if (obj instanceof Array) {
            return obj.map(item => unwrapValue(item));
        }
        else if (isObject(obj) && typeof (obj as {}).hasOwnProperty === "function" && (obj as {}).hasOwnProperty("value")) {
            return unwrapValue((obj as { value: unknown }).value);
        }
        else if (isObject(obj)) {
            const source = obj as Record<string, unknown>;
            const target = {} as Record<string, unknown>;
            for (const key of Object.keys(obj as {})) {
                if (isObject(source[key]) && typeof (source[key] as {}).hasOwnProperty === "function" && (source[key] as {}).hasOwnProperty("value")) {
                    target[key] = unwrapValue((source[key] as { value: unknown }).value); // unwrap value
                }
                else {
                    target[key] = unwrapValue(source![key]);
                }
            }
            return target;
        }
        else {
            return obj;
        }
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

    class ExtractError {
        code: ExtractErrorCode;
        message: string;
        constructor(code: ExtractErrorCode, message: string) {
            this.code = code;
            this.message = message;
        }
    }

    class ExtractContext {
        jquery: JQueryStatic;
        actions: Action[];
        state: ExtractState;
        online: boolean;
    
        constructor(jquery: JQueryStatic, url: string, actions: Action[], state: ExtractState) {
            this.jquery = jquery;
            this.actions = actions;
            this.state = state;
            this.online = typeof jquery.noConflict === "function";
        }

        break({ active, when }: Break): boolean {
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

        async click({ $, waitfor, snooze, required, retry, active, when }: Click): Promise<void> {
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
                        result.nodes[0].click();
                        if (waitfor) {
                            const ok = await this.waitfor(waitfor, "CLICK");
                            if (ok) {
                                if (snooze && (mode === "after" || mode === "before-and-after")) {
                                    const seconds = snooze[0];
                                    this.log(`CLICK SNOOZE AFTER (${seconds}s) ${$statements($)}`);
                                    await sleep(seconds * 1000);
                                }
                            }
                            else {
                                this.error("click-timeout", `Timeout waiting for click result. ${trunc(waitfor.$)}`);
                            }
                        }
                    }
                    else if (required) {
                        this.error("click-required", `Required click target not found. ${trunc($)}`);
                    }
                }
                else {
                    this.log(`CLICK SKIPPED ${$statements($)}`);
                }
            }
            else {
                this.log(`CLICK BYPASSED ${$statements($)}`);
            }
        }

        async dispatch(action: Action, step: number): Promise<DispatchResult> {
            if (action.hasOwnProperty("select")) {
                const data = this.select((action as SelectAction).select);
                this.state.data = merge(this.state.data, data);
            }
            else if (action.hasOwnProperty("break")) {
                if (this.break((action as BreakAction).break)) {
                    return { break: true, yield: false };
                }
            }
            else if (action.hasOwnProperty("click")) {
                await this.click((action as ClickAction).click);
            }
            else if (action.hasOwnProperty("do")) {
                await this.do((action as DoAction).do);
            }
            else if (action.hasOwnProperty("repeat")) {
                await this.repeat((action as RepeatAction).repeat);
            }
            else if (action.hasOwnProperty("snooze")) {
                await this.snooze((action as SnoozeAction).snooze);
            }
            else if (action.hasOwnProperty("waitfor")) {
                await this.waitfor((action as WaitForAction).waitfor);
            }
            else if (action.hasOwnProperty("yield")) {
                const waitfor = this.yield((action as YieldAction).yield || {});
                if (waitfor) {
                    this.state.yield = { step, waitfor };
                    return { break: false, yield: true };
                }
            }
            return { break: false, yield: false };
        }

        async do({ $, active, when }: Do): Promise<void> {
            if (this.online && (active ?? true)) {
                if (this.when(when, "DO")) {
                    for (const query of $) {
                        const selector = query[0];
                        const ops = query.slice(1) as SelectQueryOp[];
                        if (selector === "{window}" && ops[0][0] === "scrollBottom") {
                            this.log(`DO ${$statement(query)}`);
                            await $scrollToBottom();
                        }
                        else {
                            this.log(`DO ${$statement(query)}`);
                            this.resolveQuery(query, "string", false, false, null);
                        }
                    }
                }
                else {
                    this.log(`DO SKIPPED ${$statements($)}`);
                }
            }
            else {
                this.log(`DO BYPASSED ${$statements($)}`);
            }
        }

        error(code: ExtractErrorCode, message: string): void {
            this.state.errors.push({ code, message });
            this.log(`ERROR (${code}): ${message}`);
        }

        async execute(actions: Action[], start = 1): Promise<void> {
            for (const action of actions) {
                const step = actions.indexOf(action) + 1;
                if (step >= start) {
                    this.log(`step ${step}/${actions.length}`);
                    const result = await this.dispatch(action, step);
                    if (result.break || result.yield) {
                        this.log(`break at step ${step}/${actions.length}`);
                        return;
                    }
                }
            }
            this.log(`${actions.length} steps complete`);
        }
        
        formatResult(result: QueryResult, type: SelectType, all: boolean, limit: number | null | undefined, format: SelectFormat = "multiline", pattern: string | undefined): QueryResult {
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

        formatValue(value: unknown, type: SelectType, format: SelectFormat): unknown {
            type = type?.toLowerCase() as SelectType;
            format = format?.toLowerCase() as SelectFormat;
            if (typeof value === "string") {
                if (type === "number") {
                    return parseNumber(value);
                }
                else if (type === "boolean") {
                    return value.trim().length > 0;
                }
                else if (format === "href" && typeof value === "string" && this.state.origin) {
                    return combineUrl(this.state.origin, value);
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
            }
            return value;
        }

        keypath(name: string | undefined, context: SelectContext | undefined): string {
            return context ? `${context.name}.${name || "."}` : `${name || ""}`;
        }

        log(text: string): void {
            if (this.state.debug) {
                this.state.log.push(text);
            }
        }

        mergeQueryResult(source: QueryResult | undefined, target: QueryResult | undefined): QueryResult | undefined {
            if (source && target) {
                let nodes = source.nodes && target.nodes ? this.jquery([...source.nodes.toArray(), ...target.nodes.toArray()]) : target.nodes || source.nodes;
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

        query({ $, type = "string", repeated = false, all = false, format, pattern, limit }: QueryParams, context?: SelectContext): QueryResult | undefined {
            if (limit === undefined && type === "string" && !repeated && !all) {
                limit = 1;
            }
            if ($ instanceof Array && $.every(query => query instanceof Array) && $[0].length > 0 && !!$[0][0]) {
                let result: QueryResult | undefined = undefined;
                for (const query of $) {
                    const subresult = this.resolveQuery(query, type, repeated, all, limit, format, pattern, context);
                    result = this.mergeQueryResult(result, subresult);
                    this.log(`${$statement(query)} -> ${trunc(subresult.value)} (${subresult.nodes.length} nodes) ${$.indexOf(query) + 1}/${$.length}${subresult !== result ? ` (merged ${result!.nodes.length} nodes)` : ""}${pattern ? `, pattern=${pattern}, valid=${subresult.valid}` : ""}`);
                    if (!all && subresult.nodes.length > 0) {
                        break;
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

        async repeat(actions: Action[]): Promise<void> {
            let i = 0;
            let done = false;
            while (!done) {
                this.log(`REPEAT #${++i}`);
                if (i >= 25) {
                    this.log(`REPEAT MAX`);
                    break;
                }
                this.state._page = i;
                for (const action of actions) {
                    const step = actions.indexOf(action) + 1;
                    const result = await this.dispatch(action, step);
                    if (result.break) {
                        break;
                    }
                }
            }
        }

        resolveQuery(query: SelectQuery, type: SelectType, repeated: boolean, all: boolean, limit: number | null | undefined, format?: SelectFormat, pattern?: string, context?: SelectContext): QueryResult {
            const selector = query[0];
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
                nodes = this.jquery(selector, context?.nodes);
                value = this.text(nodes, format);
            }

            if (ops.length > 0) {
                return this.resolveQueryOps({ ops, nodes, type, repeated, all, limit, format, pattern, value });
            }
            else if (type === "boolean") {
                // if type is boolean then result is based on whether the query resulted in any hits
                return {
                    nodes,
                    value: !repeated ? nodes.length > 0 : [nodes.length > 0]
                }
            }
            else {
                return this.formatResult({ nodes, value }, type, all, limit, format, pattern);
            }            
        }

        resolveQueryOps({ ops, nodes, type, repeated, all, limit, format, pattern, value }: QueryResolveParams): QueryResult {
            const result: QueryResult = { nodes, value };
            const a = ops.slice(0);
            while (a.length > 0) {
                const [operator, ...operands] = a.shift()!;
                if (operator === "cut") {
                    if (!this.validateOperands(operator, operands, ["string", "number"], ["number"])) {
                        result.value = null;
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
                        result.value = null;
                        break;
                    }
                    const regexp = createRegExp(operands[0]);
                    const keepUnmatchedItems = operands[1] as boolean;
                    if (!regexp) {
                        result.value = null;
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
                else if (operator === "filterText") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        result.value = null;
                        break;
                    }
                    const regexp = createRegExp(operands[0]);
                    if (regexp && result.value instanceof Array && result.value.length === result.nodes.length && result.value.every(value => typeof value === "string")) {
                        const elements = result.nodes.toArray();
                        const values = result.value as string[];
                        for (let i = result.value.length - 1; i >= 0; --i) {
                            if (!regexp.test(result.value[i])) {
                                elements.splice(i, 1);
                                values.splice(i, 1);
                            }
                        }
                        result.nodes = this.jquery(elements);
                        result.value = values;
                    }
                }
                else if (operator === "first") {
                    result.nodes = this.jquery(result.nodes.toArray()[0]);
                    result.value = result.value instanceof Array ? result.value[0] : null;
                }
                else if (operator === "html" && (operands[0] === "outer" || operands[0] === undefined)) {
                    if (this.online) {
                        result.value = result.nodes.toArray().map(element => element.outerHTML);
                    }
                    else {
                        const cheerio = this.jquery as unknown as CheerioAPI;
                        result.value = result.nodes.toArray().map(element => cheerio.html(element as unknown as CheerioNode));
                    }
                }
                else if (operator === "last") {
                    result.nodes = this.jquery(result.nodes.toArray()[result.nodes.length - 1]);
                    result.value = result.value instanceof Array ? result.value[result.value.length - 1] : null;
                }
                else if (operator === "ltrim") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        result.value = null;
                        break;
                    }
                    result.value = resolveQueryStringValue(result.value, text => ltrim(text, createRegExp(operands[0]) || operands[0] as string));
                    //todo: log
                }
                else if (operator === "replace") {
                    if (!this.validateOperands(operator, operands, ["string", "string"])) {
                        result.value = null;
                        break;
                    }
                    const regexp = createRegExp(operands[0]);
                    if (!regexp) {
                        result.value = null;
                    }
                    else if (result.value instanceof Array && result.value.every(value => typeof value === "string")) {
                        result.value = result.value.map(value => regexpReplace(value, regexp, operands[1] as string));
                    }
                    else if (typeof result.value === "string") {
                        result.value = regexpReplace(result.value, regexp, operands[1] as string);
                    }
                    else {
                        result.value = null;
                    }
                    //todo: log
                }
                else if (operator === "rtrim") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        result.value = null;
                        break;
                    }
                    result.value = resolveQueryStringValue(result.value, text => rtrim(text, createRegExp(operands[0]) || operands[0] as string));
                    //todo: log
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
                else if (operator === "startsWith" && operands[0]) {
                    const pattern = operands[0] as string;
                    result.nodes = this.jquery(result.nodes.toArray().filter(element => this.jquery(element).text().trim().startsWith(pattern)));
                    result.value = this.text(result.nodes, format);
                }
                else if (operator === "text" && operands[0] === "inline") {
                    result.value = result.nodes.toArray().map((element: Element) => 
                        Array.from(element.childNodes)
                            .filter(node => node.nodeType === 3) // 3 is a TEXT_NODE
                            .map(node => node.textContent ?? (node as any).data) // dom has node.textContent, cheero has node.data
                            .join(" ")
                            .trim()
                            .replace(/[ ]{2,}/, " ")
                    );
                }
                else if (operator === "trim") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        result.value = null;
                        break;
                    }
                    result.value = resolveQueryStringValue(result.value, text => trim(text, createRegExp(operands[0]) || operands[0] as string));
                    //todo: log
                }
                else if (operator === ":not(:blank)") {
                    result.nodes = this.jquery(result.nodes.toArray().filter(element => this.jquery(element).text().trim().length > 0));
                    result.value = this.text(result.nodes, format);
                }
                // invoke any function within JQuery<T> that matches operator
                else if (isInvocableFrom(result.nodes, operator)) {
                    const delegate = result.nodes as unknown as JQueryDelegate;
                    const obj = delegate[operator](...operands);
                    if (isJQueryObject(obj)) {
                        result.nodes = obj;
                        result.value = this.text(result.nodes, format);
                    }
                    else if (repeated) {
                        result.value = result.nodes.toArray().map(element => {
                            const delegate = this.query(element) as unknown as JQueryDelegate;
                            const obj = delegate[operator](...operands);
                            return obj;
                        });
                    }
                    else {
                        result.value = obj;
                    }
                }
                else {
                    this.error("invalid-operator", `'${operator}' not found`);
                    break;
                }
            }
            return this.formatResult(result, type, all, limit, format, pattern);
        }

        select(selects: Select[], context?: SelectContext): unknown {
            const data = {} as Record<string, DataItem | null>;
            for (const select of selects) {
                if (select.active ?? true) {
                    let item: DataItem | null = null;
                    if (this.when(select.when)) {
                        if (select.pivot) {
                            item = this.selectResolvePivot(select, item, context);
                        }
                        else if (select.$) {
                            item = this.selectResolve(select, item, context);
                        }
                        else if (select.union) {
                            item = this.selectResolveUnion(select, item, context, data);
                        }
                        else if (select.value) {
                            item = this.selectResolveValue(select, data);
                            /*
                            const obj = {
                                data: merge(this.data, data),
                                params: this.params,
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
                        this.error("select-required", `Required select '${context?.name ? `${context.name}.${select.name}` : select.name}' not found`);
                    }
    
                    if (select.name?.startsWith("_") && item) {
                        this.state[select.name] = item.value;
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

        selectResolve(select: Select, item: DataItem | null, context: SelectContext | undefined): DataItem | null {
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

        selectResolvePivot(select: Select, item: DataItem | null, context: SelectContext | undefined): DataItem | null {
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

        selectResolveUnion(select: Select, item: DataItem | null, context: SelectContext | undefined, data: unknown): DataItem | null {
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

        selectResolveValue(select: Select, data?: Record<string, DataItem | null>): DataItem {
            const obj = {
                ...this.state,
                data: merge(this.state.data, data)
            };
            const value = coerceValue(expandTokens(select.value, obj), select.type || "string");
            return {
                nodes: [],
                value: select.repeated ? [value] : value
            };
        }

        async snooze(interval: Snooze): Promise<void> {
            this.log(`SNOOZE ${interval[0]}s`);
            await sleep(interval[0] * 1000);
        }

        text(nodes: JQuery<HTMLElement>, format: SelectFormat | undefined): string[] {
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

        validateOperands(operator: SelectQueryOperator, operands: SelectQueryOperand[], required: Array<"string" | "number" | "boolean">, optional: Array<"string" | "number" | "boolean"> = []): boolean {
            for (let i = 0; i < required.length; ++i) {
                if (typeof operands[i] !== required[i]) {
                    this.error("invalid-operand", `'${operator}' operand #${i + 1} is invalid: "${operands[i]}" is not a ${required[i]}`);
                    return false;
                }
            }
            for (let i = 0; i < optional.length; ++i) {
                const j = i + required.length;
                //if (!isNullOrUndefined(operands[j]) && typeof operands[j] !== optional[i]) {
                if (operands[j] !== undefined && operands[j] !== null && typeof operands[j] !== optional[i]) {
                    this.error("invalid-operand", `'${operator}' operand #${j + 1} is invalid: "${operands[j]}" is not a ${optional[i]}`);
                    return false;
                }
            }
            return true;
        }

        async waitfor({ $, select, timeout, on = "any", pattern, when, active }: WaitFor, context?: string): Promise<boolean | undefined> {
            if (this.online && (active ?? true)) {
                if (this.when(when, "WAITFOR")) {
                    if (timeout === undefined) {
                        timeout = 30;
                    }
                    else if (timeout === null || timeout <= 0) {
                        timeout = Infinity;
                    }
        
                    let pass = false;
                    if ($) {
                        this.log(`${context ? `${context} ` : ""}WAITFOR QUERY ${trunc($)} on=${on}, timeout=${timeout}, pattern=${pattern}`);
                        pass = await this.waitforQuery($, on, timeout, pattern, context);
                    }
                    else if (select) {
                        this.log(`${context ? `${context} ` : ""}WAITFOR SELECT ${trunc(select)} on=${on}, timeout=${timeout}, pattern=${pattern}`);
                        pass = await this.waitforSelect(select, on, timeout, pattern, context);
                    }
                    return pass;
                }
                else {
                    this.log(`${context ? `${context} ` : ""}WAITFOR BYPASSSED ${$statements($)}`);
                }
            }
            else {
                this.log(`${context ? `${context} ` : ""}WAITFOR SKIPPED ${$statements($)}`);
            }
        }

        async waitforQuery($: SelectQuery[], on: WaitForOn, timeout: number, pattern: string | undefined, context: string | undefined): Promise<boolean> {
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
            this.log(`${context ? `${context} ` : ""}WAITFOR QUERY ${$statements($)} -> ${trunc(result?.value)}${pattern ? ` (valid=${result?.valid})` : ""} -> on=${on} -> ${pass} (${elapsed}s${elapsed > timeout ? " TIMEOUT": ""})`);
            return pass;
        }

        async waitforSelect(selects: Select[], on: WaitForOn, timeout: number, pattern: string | undefined, context: string | undefined): Promise<boolean> {
            for (const select of selects) {
                if (!select.name || !select.name.startsWith("_") || !(!select.type || select.type === "boolean") || select.repeated) {
                    this.error("invalid-select", "waitfor select must all be internal, boolean, and not repeated");
                    return true;
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
                        this.state[select.name!] = result.value;
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

            this.log(`${context ? `${context} ` : ""}WAITFOR SELECT ${JSON.stringify(state)}${pattern ? "valid=???" : ""} -> on=${on} -> ${pass} (${elapsed}s${elapsed > timeout ? " TIMEOUT": ""})`);
            return pass;
        }

        when(when: When | undefined, context?: string): boolean {
            if (when && /^\{\!?_[a-z0-9_]+\}$/i.test(when)) {
                const i = when.indexOf("_");
                const key = when.slice(i, -1);
                const negate = when.includes("!");
                const value = this.state[key];
                const result = negate ? !value : !!value;
                this.log(`${context ? `${context} ` : ""}WHEN ${JSON.stringify(when)} -> ${JSON.stringify(value)} -> ${result}`);
                return result;
            }
            else if (when !== undefined) {
                this.log(`${context ? `${context} ` : ""}WHEN ${JSON.stringify(when)} -> invalid`);
            }
            return true;
        }

        yield({ active, when, waitfor = "load" }: Yield): YieldWaitFor | undefined {
            if (this.online && (active ?? true)) {
                if (this.when(when, "YIELD")) {
                    this.log(`YIELD ${when} -> ${waitfor}`);
                    return waitfor;
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

    if (!url) {
        url = window.location.href;
    }
    const { domain, origin } = parseUrl(url);
    if (!domain || !origin) {
        throw new Error("Invalid url");
    }

    const obj = new ExtractContext(
        (root as JQueryStatic) || $,
        url || window.location.href,
        actions,
        {
            params: {},
            log: [],
            errors: [],
            data: null,
            ...state,
            url,
            domain,
            origin,
            debug
        });

    try {
        await obj.execute(obj.actions, step);
    }
    catch (err) {
        if (err instanceof ExtractError) {
            obj.state.errors.push(err);
        }
        else {
            obj.error("unknown-error", err instanceof Error ? err.message : "Unknown error.");
        }
    }

    return {
        ...obj.state,
        ok: obj.state.errors.length === 0,
        online: obj.online,
        log: obj.state.debug ? obj.state.log.join("\n") : undefined,
        data: !nodes ? unwrapValue(obj.state.data) : obj.state.data // deprecated
    };
}
