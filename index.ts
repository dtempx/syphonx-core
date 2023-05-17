import { CheerioAPI } from "cheerio";

export { unwrap } from "./common/unwrap.js";
export { evaluateFormula } from "./common/formula.js";

export interface Break {
    name?: string;
    query?: SelectQuery[];
    on?: SelectOn; // only used with query
    pattern?: string; // only used with query, waits for a specific text pattern if specified
    when?: When; // if when is specified then when is evaluated first, and then query is evaluated next if specified, if when not specified then query is evaluated by itself
    active?: boolean;
}

export interface Click {
    name?: string;
    query: SelectQuery[];
    waitfor?: WaitFor; // skip if no nodes selected
    snooze?: SnoozeInterval;
    required?: boolean;
    retry?: number;
    when?: When;
    active?: boolean;
}

export interface Each {
    name?: string;
    query: SelectQuery[];
    actions: Action[];
    context?: number | null; // sets context of selector query, or specify null for global context (default=1)
    when?: When;
    active?: boolean;
}

export interface Error {
    name?: string;
    message: string;
    code?: ExtractErrorCode; // default is "custom-error"
    level?: number; // indicates error level, 0 is non-retryable, 1 or above is retryable (default=1)
    stop?: boolean; // stops processing, default is false if level is 0 or not specified, otherwise true
    query?: SelectQuery[];
    when?: When;
    active?: boolean;
}

export interface Locator {
    name?: string;
    selector: string;
    actions: Action[];
    when?: string;
}

export interface Repeat {
    name?: string;
    actions: Action[];
    limit?: number | string; // max # of repitions (default=100) or a forumla to calculate the limit
    errors?: number; // error limit (default=1)
    when?: When;
    active?: boolean;
}

export interface Scroll {
    name?: string;
    query?: SelectQuery[];
    target?: ScrollTarget; // Determines the target of the scroll as top, bottom, or query
    behavior?: ScrollBehavior; // Determines whether to scroll smoothly or immediately jump to target (default=smooth)
    block?: ScrollLogicalPosition; // Determines vertical alignment (default=start)
    inline?: ScrollLogicalPosition; // Determines horizontal alignment (default=nearest)
    when?: When;
    active?: boolean;
}

export interface SelectTarget {
    query?: SelectQuery[];
    pivot?: SelectTarget;
    select?: Select[];
    value?: unknown;
    all?: boolean; // includes all query stage hits instead of just the first stage (default=false)
        // if values are arrays then results are merged
        // if values are strings then results are concatenated with newlines
        // if values are booleans then results are and'ed together
        // otherwise the latest result takes precedence
    hits?: number | null; // DEPRECATED, use `all` instead // limits the number of query stage hits, default is unlimited or specify null for unlimited (null)
    limit?: number | null; // limits the number of nodes returned by the query, when repeated is false and all is false then default=1 otherwise default is unlimited (null), specify null to force unlimited nodes
    format?: SelectFormat; // default is multiline when type=string, whitespace is added for multiline and singleline, none is the same as text(), innertext and textcontent only work online
    pattern?: string; // validation pattern (only applies if type=string)
    collate?: boolean; // causes selector to be processed as a single unit rather than processed as a single unit rather than for each node or each value
    context?: number | null; // sets context of selector query, or specify null for global context (default=1)
    negate?: boolean; // negates a boolean result
    removeNulls?: boolean; // removes null values from arrays
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

export interface Switch {
    name?: string;
    query?: SelectQuery[];
    actions: Action[];
    when?: string;
}

export interface Transform {
    name?: string;
    query: SelectQuery;
    when?: When;
    active?: boolean;
}

export interface WaitFor {
    name?: string;
    query?: SelectQuery[];
    select?: Select[];
    on?: SelectOn; // used with query or select
    timeout?: number; // used with query or select
    pattern?: string; // waits for a specific text pattern if specified
    required?: boolean; // indicates whether processing should stop with an error on timeout
    when?: When; // if when is specified then when is evaluated first, and then query or select is evaluated next if specified, if when not specified then query or select are evaluated by itself
    active?: boolean;
}

export interface Yield {
    name?: string;
    params?: YieldParams;
    when?: When;
    active?: boolean;
}

export type ScrollTarget = "top" | "bottom";

export type SelectType = "string" | "number" | "boolean" | "object"; // document how formatResult works and coerceValue converts different values to the target type
export type SelectQuery = [string, ...SelectQueryOp[]];
export type SelectQueryOp = [string, ...unknown[]];
export type SelectQueryOperator = string;
export type SelectQueryOperand = unknown;
export type SelectFormat = "href" | "multiline" | "singleline" | "innertext" | "textcontent" | "none";
export type SelectOn = "any" | "all" | "none";

export type Snooze = [number, number];

export type BreakAction = { break: Break };
export type ClickAction = { click: Click };
export type EachAction = { each: Each };
export type ErrorAction = { error: Error };
export type LocatorAction = { locator: Locator };
export type RepeatAction = { repeat: Repeat };
export type ScrollAction = { scroll: Scroll };
export type SelectAction = { select: Select[] };
export type SnoozeAction = { snooze: Snooze };
export type SwitchAction = { switch: Switch[] };
export type TransformAction = { transform: Transform[] };
export type WaitForAction = { waitfor: WaitFor };
export type YieldAction = { yield: Yield };

export type Action =
      BreakAction
    | ClickAction
    | EachAction
    | ErrorAction
    | LocatorAction
    | RepeatAction
    | ScrollAction
    | SelectAction
    | SnoozeAction
    | SwitchAction
    | TransformAction
    | WaitForAction
    | YieldAction;

export interface QueryParams {
    query?: SelectQuery[];
    type?: SelectType;
    repeated?: boolean;
    all?: boolean;
    format?: SelectFormat;
    pattern?: string;
    limit?: number | null;
    negate?: boolean;
    removeNulls?: boolean;
    hits?: number | null;
}

export interface QueryResult {
    nodes: JQueryResult;
    key: string;
    value: unknown;
    valid?: boolean;
    formatted?: boolean;
}

export type JQueryResult = JQuery<any>;
export type JQueryDelegate = Record<string, (...args: unknown[]) => JQuery<HTMLElement>>;

export type When = string;
export type SnoozeMode = "before" | "after" | "before-and-after"; // default=before
export type SnoozeInterval = [number, number] | [number, number, SnoozeMode]; //seconds

export type DocumentLoadState = "load" | "domcontentloaded" | "networkidle";

export interface ExtractState {
    [key: string]: any;
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
    yield?: YieldState;
    root?: unknown;
    originalUrl?: string;
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
    level: number;
    key?: string;
    stack?: string;
}

export type ExtractErrorCode = 
    "click-timeout" |
    "click-required" |
    "custom-error" |
    "error-limit" |
    "eval-error" |
    "external-error" |
    "fatal-error" |
    "invalid-select" |
    "invalid-operator" |
    "invalid-operand" |
    "select-required" |
    "waitfor-timeout";

export interface YieldParams extends Record<string, unknown> {
    timeout?: number;
    waitUntil?: DocumentLoadState;
    locator?: YieldLocator;
}

export interface YieldLocator {
    selector: string;
    actions: Action[];
}

export interface YieldState {
    step: number[];
    params?: YieldParams;
    level?: number;
}

type SelectContextAction = "each" | "pivot" | "subselect" | "union"
type DispatchResult = "break" | "yield" | "timeout" | "required" | null;

interface DataItem {
    key: string;
    value: unknown;
    nodes: string[];
}

interface ExtractStateInternal extends ExtractState {
    vars: ExtractStateInternalVars;
}

interface ExtractStateInternalVars extends Record<string, unknown> {
    __instance: number;
    __context: SelectContext[];
    __repeat: Record<number, RepeatState | undefined>;
    __step: number[];
    __yield: number[] | undefined;
}

interface RepeatState {
    index: number;
    errors: number;
}

interface ResolveQueryParams {
    query: SelectQuery;
    repeated: boolean;
    all: boolean;
    limit: number | null | undefined;
    type?: SelectType;
    format?: SelectFormat;
    pattern?: string;
    negate?: boolean;
    removeNulls?: boolean;
    result?: QueryResult;
}

interface ResolveQueryOpsParams {
    ops: SelectQueryOp[];
    nodes: JQueryResult;
    value: unknown;
    type?: SelectType;
    repeated: boolean;
    all: boolean;
    limit?: number | null;
    format?: SelectFormat;
    pattern?: string;
    negate?: boolean;
    removeNulls?: boolean;
}

interface SelectContext {
    name?: string;
    nodes?: JQueryResult;
    value?: unknown;
    index?: number;
    pivot?: number;
    union?: number;
    action?: SelectContextAction;
    parent?: SelectContext;
}

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
            return typeof value === "boolean" ? value : typeof value === "string" ? value.trim().length > 0 : typeof value === "number" && !isNaN(value) ? value !== 0 : null;
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

    function formatHTML(value: unknown): unknown {
        if (typeof value === "string") {
            return value
                .replace(/(<[a-z0-9:._-]+>)[ ]*/gi, "$1") // remove all spaces that immediately follow an opening tag
                .replace(/[ ]*<\//g, "</"); // remove all spaces that immediately precede a closing tag
        }
        else if (value instanceof Array && value.every(obj => typeof obj === "string")) {
            return value.map(obj => formatHTML(obj));
        }
        else {
            return value;
        }
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
    
    function parseUrl(url: string | undefined): { domain?: string, origin?: string } {
        if (typeof url === "string" && /^https?:\/\//.test(url)) {
            const [protocol, , host] = url.split("/");
            const a = host.split(":")[0].split(".").reverse();
            return {
                domain: a.length >= 3 && a[0].length === 2 && a[1].length === 2 ? `${a[2]}.${a[1]}.${a[0]}` : a.length >= 2 ? `${a[1]}.${a[0]}` : undefined,
                origin: protocol && host ? `${protocol}//${host}` : undefined
            };    
        }
        return {};
    }
    
    function regexpExtract(text: string, regexp: RegExp | string, trim = true): string | null {
        if (typeof regexp === "string") {
            regexp = createRegExp(regexp)!;
            if (!regexp) {
                return null;
            }
        }
        const match = regexp.exec(text);
        const result = match ? match[1] : null;
        if (trim && result) {
            return result.trim();
        }
        else {
            return result;
        }
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
        if (obj) {
            const text = JSON.stringify(obj);
            if (typeof text === "string")
                return text.length <= max ? text : `${text[0]}${text.slice(1, max)}…${text[text.length - 1]}`;
        }
        return "(empty)";
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

    // waits for no scroll event to occur within a window of 200ms, or 3s maximum
    function waitForScrollEnd(): Promise<void> {
        return new Promise<void>(resolve => {
            let timer = setTimeout(() => resolve(), 3000);
            function onScroll() {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    removeEventListener("scroll", onScroll);
                    resolve();
                }, 200);
            }
            addEventListener("scroll", onScroll);
        });
    }

    function $merge(source: JQuery<HTMLElement>, target: JQuery<HTMLElement>): void {
        for (const targetAttr of Array.from(target[0].attributes)) {
            const sourceAttr = Array.from(source[0].attributes).find(attr => attr.name === targetAttr.name);
            if (sourceAttr && targetAttr.name === "class") {
                const value = Array.from(new Set([
                    ...sourceAttr.value.split(" "),
                    ...targetAttr.value.split(" ")
                ])).join(" ");
                source.attr("class", value);
            }
            else if (!sourceAttr) {
                source.attr(targetAttr.name, targetAttr.value);
            }
        }
    }

    function $scrollToBottom(delay = 100, max = 100): Promise<number> {
        let n = 0;
        return new Promise(resolve => {
            const timer = setInterval(() => {
                window.scrollBy(0, window.innerHeight);
                n += 1;
                if ((window.scrollY >= document.body.scrollHeight - window.innerHeight) || (--max < 1)) {
                    clearInterval(timer);
                    resolve(n);
                }
            }, delay);
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

    function $statements(query: SelectQuery[] | undefined): string {
        if (query && query.length > 0)
            return `${$statement(query[0])}${query.length > 1 ? ` (+${query.length - 1} more))` : ""}`;
        else
            return "(none)";
    }

    class ExtractContext {
        jquery: JQueryStatic & CheerioAPI;
        state: ExtractStateInternal;
        online: boolean;
        lastLogLine = "";
        lastLogLength = 0;
        lastLogTimestamp = 0;
    
        constructor(state: Partial<ExtractState>) {
            this.jquery = (state.root as JQueryStatic & CheerioAPI) || $;
            this.online = typeof this.jquery.noConflict === "function";

            if (this.online)
                state.url = window.location.href;
            const { domain, origin } = parseUrl(state.url);

            if (state.__locator) {
                state.data = merge(state.data, state.__locator); // merge locator data into state data
                state.__locator = undefined; // clear out the locator state
            }

            this.state = {
                params: {},
                errors: [],
                log: "",
                ...state, // may include params, data, log, errors, debug, root
                yield: undefined, // yield state discarded on re-entry
                vars: {
                    __instance: 0, // initialize or carry over from previous instance
                    __context: [], // initialize or carry over from previous instance
                    __repeat: {}, // initialize or carry over from previous instance
                    ...state.vars,
                    __step: [], // initialize fresh on every instance
                    __yield: state.yield?.step
                },
                domain,
                origin
            } as ExtractStateInternal;
        }

        appendError(code: ExtractErrorCode, message: string, level: number, stack?: string): void {
            const key = this.contextKey();
            this.state.errors.push({ code, message, key, level, stack });
            const text = `ERROR ${key ? `${key}: ` : ""}${message} code=${code} level=${level}${stack ? `\n${stack}` : ""}`
            this.log(text);
        }

        private break({ name = "", query, on = "any", pattern, when, active = true }: Break): boolean {
            if (name)
                name = " " + name;
            if (this.online && active) {
                if (this.when(when, "BREAK")) {
                    if (query) {
                        this.log(`BREAK${name} WAITFOR QUERY ${trunc($)} on=${on}, pattern=${pattern}`);
                        const [pass, result] = this.queryCheck(query, on, pattern);
                        this.log(`BREAK${name} QUERY ${$statements(query)} -> ${trunc(result?.value)}${pattern ? ` (valid=${result?.valid})` : ""} -> on=${on} -> ${pass}`);
                        if (pass) {
                            this.log(`BREAK${name} ${when || ""}`);
                            return true;
                        }
                    }
                    else {
                        this.log(`BREAK${name} ${when || ""}`);
                        return true;
                    }
                }
                else {
                    this.log(`BREAK${name} SKIPPED ${when}`);
                }
            }
            else {
                this.log(`BREAK${name ? ` ${name}` : ""} BYPASSED ${when}`);
            }
            return false;
        }

        private async click({ name, query, waitfor, snooze, required, retry, when, active = true }: Click): Promise<"timeout" | "not-found" | null> {
            if (this.online && active) {
                if (this.when(when, `CLICK${name ? ` ${name}` : ""}`)) {
                    const mode = snooze ? snooze[2] || "before" : undefined;
                    if (snooze && (mode === "before" || mode === "before-and-after")) {
                        const seconds = snooze[0];
                        this.log(`CLICK${name ? ` ${name}` : ""} SNOOZE BEFORE (${seconds}s) ${$statements(query)}`);
                        await sleep(seconds * 1000);
                    }
                    const result = this.query({ query });
                    if (result && result.nodes.length > 0) {
                        if (this.clickElement(result.nodes[0], $statements(query))) {
                            if (waitfor) {
                                const code = await this.waitfor(waitfor, "CLICK");
                                if (!code) {
                                    if (snooze && (mode === "after" || mode === "before-and-after")) {
                                        const seconds = snooze[0];
                                        this.log(`CLICK${name ? ` ${name}` : ""} SNOOZE AFTER (${seconds}s) ${$statements(query)}`);
                                        await sleep(seconds * 1000);
                                    }
                                }
                                else if (code === "timeout") {
                                    this.appendError("click-timeout", `Timeout waiting for CLICK${name ? ` ${name}` : ""} result. ${trunc(waitfor.query)}${waitfor.pattern ? `, pattern=${waitfor.pattern}` : ""}`, 1);
                                    return "timeout";
                                }
                                else if (code === "invalid") {
                                    // error already recorded, do nothing more
                                }
                            }
                        }
                    }
                    else {
                        if (required) {
                            this.appendError("click-required", `Required click target not found. ${trunc(query)}`, 1);
                        }
                        return "not-found";
                    }
                }
                else {
                    this.log(`CLICK${name ? ` ${name}` : ""} SKIPPED ${$statements(query)}`);
                }
            }
            else {
                this.log(`CLICK${name ? ` ${name}` : ""} BYPASSED ${$statements(query)}`);
            }
            return null;
        }

        private clickElement(element: unknown, context: string): boolean {
            if (element instanceof HTMLElement) {
                if (element instanceof HTMLOptionElement && element.parentElement instanceof HTMLSelectElement) {
                    this.log(`CLICK ${context} <select> "${element.parentElement.value}" -> "${element.value}"`);
                    element.parentElement.value = element.value;
                    element.parentElement.dispatchEvent(new Event("change", { bubbles: true, cancelable: false }));
                    element.parentElement.dispatchEvent(new Event("input", { bubbles: true, cancelable: false }));
                }
                else {
                    this.log(`CLICK ${context}`);
                    element.click();
                }
                return true;
            }
            else {
                this.log(`CLICK ${context} not insanceof HTMLElement`);
                return false;
            }
        }

        private context(): SelectContext {
            const stack = this.state.vars.__context;
            let j = stack.length - 1;
            const context = { ...stack[j] };
            let subcontext = context;
            while (--j >= 0) {
                subcontext.parent = { ...stack[j] };
                subcontext = subcontext.parent;
            }
            return context;
        }

        private contextKey(): string {
            const stack = this.state.vars.__context;
            let key = "";
            for (const { name, index } of stack) {
                if (name) {
                    if (key) {
                        key += ".";
                    }
                    key += name;
                    if (index !== undefined) {
                        key += `[${index}]`;
                    }
                }
            }
            return key;
        }

        private contextKeyInfo() {
            const key = this.contextKey();
            const stack = this.state.vars.__context;
            let info = "";
            if (stack.length > 0) {
                const [top] = stack.slice(-1);
                if (top.pivot !== undefined) {
                    info = `PIVOT(${top.pivot})`;
                }
                else if (top.union !== undefined) {
                    info = `UNION(${top.union})`;
                }
                else if (top.action !== undefined) {
                    info = `${top.action.toUpperCase()}`;
                }
            }
            return info ? `${key} ${info}` : key;
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
            else if (action.hasOwnProperty("each")) {
                await this.each((action as EachAction).each);
            }
            else if (action.hasOwnProperty("error")) {
                this.error((action as ErrorAction).error);
            }
            else if (action.hasOwnProperty("locator")) {
                await this.locator((action as LocatorAction).locator);
            }
            else if (action.hasOwnProperty("repeat")) {
                await this.repeat((action as RepeatAction).repeat);
            }
            else if (action.hasOwnProperty("scroll")) {
                await this.scroll((action as ScrollAction).scroll);
            }
            else if (action.hasOwnProperty("snooze")) {
                await this.snooze((action as SnoozeAction).snooze);
            }
            else if (action.hasOwnProperty("switch")) {
                await this.switch((action as SwitchAction).switch);
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
                this.yield((action as YieldAction).yield || {});
            }
            return null;
        }

        private async each({ name, query, actions, context, when, active = true }: Each): Promise<void> {
            const $ = this.jquery;
            if (active) {
                const label = `EACH${name ? ` ${name}` : ""}`;
                if (this.when(when, label)) {
                    const result = this.query({ query, repeated: true });
                    if (result && result.nodes.length > 0) {                        
                        const elements = result.nodes.toArray();
                        for (const element of elements) {
                            const nodes = $(element);
                            this.pushContext({
                                nodes,
                                value: this.text(nodes),
                                action: "each",
                                index: elements.indexOf(element)
                            }, context);
                            const code = await this.run(actions, label, true);
                            this.popContext();
                            if (code === "break") {
                                break;
                            }
                        }
                    }
                }
            }
        }

        private eachNode({ nodes, value }: QueryResult, callback: (node: JQuery, param: unknown) => void) {
            const $ = this.jquery;
            if (nodes) {
                const elements = nodes.toArray();
                for (let i = 0; i < elements.length; ++i) {
                    const node = $(elements[i]);
                    const subvalue = value instanceof Array ? value[i] : value;
                    callback(node, subvalue);
                }
            }
        }

        private error({ query, code = "custom-error", message = "Custom template error", level = 1, stop, when, active = true }: Error): void {
            if (active) {
                if (query) {
                    const result = this.query({ query, type: "boolean", repeated: false });
                    if (result?.value === false) {
                        this.appendError(code, String(this.evaluate(message)), level);
                        if (stop === true || (stop === undefined && level === 0)) {
                            throw "STOP";
                        }
                    }
                }
                else if (this.when(when, "ERROR")) {
                    this.appendError(code, String(this.evaluate(message)), level);
                    if (stop === true || (stop === undefined && level === 0)) {
                        throw "STOP";
                    }
                }
            }
        }

        private evaluate(input: unknown, params: Record<string, unknown> = {}): unknown {
            if (isFormula(input)) {
                const { data, ...extra } = params;
                const context = this.context();
                const args = {
                    ...this.state.vars,
                    ...this.state,
                    ...context,
                    data: removeDOMRefs(merge(this.state.data, data)),
                    ...extra
                } as Record<string, unknown>;

                try {
                    const result = evaluateFormula((input as string).slice(1, -1).trim(), args);
                    return result;
                }
                catch (err) {
                    this.appendError("eval-error", `Error evaluating formula "${input}": ${err instanceof Error ? err.message : JSON.stringify(err)}`, 0);
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

        private evaluateNumber(input: unknown, params: Record<string, unknown> = {}): number {
            const result = this.evaluate(input, params);
            return typeof result === "number" ? result : 0;
        }

        private formatResult(result: QueryResult, type: SelectType | undefined, all: boolean, limit: number | null | undefined, format: SelectFormat = "multiline", pattern: string | undefined, negate: boolean | undefined, removeNulls: boolean | undefined): QueryResult {
            const $ = this.jquery;
            const regexp = createRegExp(pattern);

            // if type not specified then default to the value's primitive type or to a string
            if (!type) {
                const defaultType = result.value instanceof Array ? typeof result.value[0] : typeof result.value;
                type = ["string", "number", "boolean"].includes(defaultType) ? defaultType as SelectType : "string";
            }

            // apply limit for repeated result
            if (limit !== undefined && limit !== null && result.value instanceof Array) {
                result.nodes = $(result.nodes.toArray().slice(0, limit));
                result.value = result.value.slice(0, limit);
            }

            if (type === "string" && result.value instanceof Array) {
                if (!result.formatted) {
                    result.value = result.value.map(value => formatStringValue(coerceValue(value, "string") as string, format, this.state.origin));
                }
                if (regexp && !isEmpty(result.value)) {
                    result.valid = (result.value as string[]).every(value => regexp.test(value));
                }
            }
            else if (type === "string") {
                if (!result.formatted) {
                    result.value = formatStringValue(coerceValue(result.value, "string") as string, format, this.state.origin);
                }
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

            if (negate) {
                if (typeof result.value === "boolean")
                    result.value = !result.value;
                else if (result.value instanceof Array && result.value.every(value => typeof value === "boolean"))
                    result.value = result.value.map(value => !value);
            }

            if (removeNulls && result.value instanceof Array) {
                result.value = result.value.filter(value => value !== null && value !== undefined);
            }

            return result;
        }

        log(text: string): void {
            if (this.state.debug) {
                // if the last line is repeated then append elapsed time to the end
                if (this.lastLogLine === text) {
                    const elapsed = (new Date().valueOf() - this.lastLogTimestamp) / 1000;
                    this.state.log = `${this.state.log.slice(0, this.lastLogLength)}${text} (${elapsed.toFixed(1)}s)\n`;
                }
                else {
                    this.lastLogLine = text;
                    this.lastLogLength = this.state.log.length;
                    this.lastLogTimestamp = new Date().valueOf();
                    this.state.log += text + "\n";
                }
            }
        }

        private mergeQueryResult(source: QueryResult | undefined, target: QueryResult | undefined): QueryResult | undefined {
            const $ = this.jquery;
            if (source && target) {
                const nodes = source.nodes && target.nodes ? $([...source.nodes.toArray(), ...target.nodes.toArray()]) : target.nodes || source.nodes;
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
                return { nodes, key: this.contextKey(), value, valid: target.valid ?? source.valid };
            }
            else if (target) {
                return target;
            }
            else {
                return source;
            }
        }

        private nodeKey(node: JQueryResult | undefined): string {
            const $ = this.jquery;
            const path = [];
            const elements = $(node && node.length > 1 ? node[0] : node).parents().addBack().not("html").toArray().reverse();
            for (const element of elements) {
                const $parent = $(element).parent();
                const tag = element.tagName.toLowerCase();
                const id = $(element).attr('id') || "";
                const className = $(element).attr('class')?.split(' ')[0] || "";
                const n = $(element).index() + 1;

                const uniqueId = /^[A-Za-z0-9_-]+$/.test(id) ? $(`#${id}`).length === 1 : false;
                const uniqueClassName = /^[A-Za-z0-9_-]+$/.test(className) ? $(`${tag}.${className}`).length === 1 : false;
                const onlyTag = $parent.children(tag).length === 1;
                const onlyClassName = /^[A-Za-z0-9_-]+$/.test(className) ? $parent.children(`${tag}.${className}`).length === 1 : false;

                if (uniqueId) {
                    path.push(`#${id}`);
                    break;
                }
                else if (uniqueClassName) {
                    path.push(`${tag}.${className}`);
                    break;
                }
                else if (onlyTag) {
                    path.push(tag);
                }
                else if (onlyClassName) {
                    path.push(`${tag}.${className}`);
                }
                else {
                    path.push(`${tag}:nth-child(${n})`);
                }
            }
            return path.reverse().join(" > ");
        }

        private nodeKeys(nodes: JQueryResult | undefined): string[] {
            if (typeof nodes === "object" && typeof nodes.toArray === "function") {
                return nodes.toArray().map(node => this.nodeKey(node));
            }
            else {
                return [];
            }
        }

        private pokeContext(context: Omit<SelectContext, 'parent' | 'name'>): void {
            const stack = this.state.vars.__context;
            const i = stack.length - 1;
            if (i >= 0) {
                stack[i] = { ...stack[i], ...context };
            }
            if (context.nodes) {
                this.log(`--> ${this.contextKeyInfo()} [${this.nodeKey(stack[stack.length - 1].nodes)}] ${trunc(stack[stack.length - 1].value)}`);
            }
        }

        private popContext(): void {
            const stack = this.state.vars.__context;
            const [top] = stack.slice(-1);
            this.log(`<<< ${this.contextKeyInfo()} [${this.nodeKey(top?.nodes)}] ${stack.length - 1}`);
            stack.pop();
        }

        private pushContext(context: Omit<SelectContext, 'parent'>, inherit: number | null | undefined): void {
            const stack = this.state.vars.__context;
            if (inherit === undefined) {
                const [parent] = stack.slice(-1);
                stack.push({
                    nodes: parent?.nodes,
                    value: parent?.value,
                    ...context
                });
            }
            else if (inherit === null) {
                stack.push({ ...context, nodes: undefined });
            }
            else if (inherit > 0 && inherit <= stack.length) {
                const [parent] = stack.slice(-1 * inherit);
                stack.push({
                    ...context,
                    nodes: parent?.nodes,
                    value: parent?.value
                });
            }
            else {
                stack.push(context);
                this.appendError("eval-error", `Undefined context #${inherit}`, 1);
            }
            this.log(`>>> ${this.contextKeyInfo()} [${this.nodeKey(stack[stack.length - 1].nodes)}] ${trunc(stack[stack.length - 1].value)} ${stack.length}`);
        }

        private query({ query, type, repeated = false, all = false, format, pattern, limit, hits, negate, removeNulls }: QueryParams): QueryResult | undefined {
            if (query instanceof Array && query.every(stage => stage instanceof Array) && query[0].length > 0 && !!query[0][0]) {
                if (limit === undefined && type === "string" && !repeated && !all) {
                    limit = 1;
                }
                if (hits === null || hits === undefined) {
                    hits = query.length;
                }
                let hit = 0;
                let result: QueryResult | undefined = undefined;
                for (const stage of query) {
                    const subresult = this.resolveQuery({ query: stage, type, repeated, all, limit, format, pattern, negate, removeNulls, result });
                    if (subresult) {
                        result = this.mergeQueryResult(result, subresult);
                        //this.log(`[${query.indexOf(stage) + 1}/${query.length}] ${$statement(query)} -> ${trunc(subresult.value)} (${subresult.nodes.length} nodes) ${subresult !== result ? ` (merged ${result!.nodes.length} nodes)` : ""}${pattern ? `, pattern=${pattern}, hit=${hit}, valid=${subresult.valid}` : ""}`);
                        if (subresult.nodes.length > 0) {
                            if (!all) {
                                this.log(`[${query.indexOf(stage) + 1}/${query.length}] STOP (first hit)`);
                                break;
                            }
                            if (++hit === hits) {
                                this.log(`[${query.indexOf(stage) + 1}/${query.length}] STOP (${hits} hits)`);
                                break;
                            }
                        }
                    }
                    else {
                        //this.log(`[${$.indexOf(stage) + 1}/${query.length}] ${$statement(query)} -> (none)${pattern ? `, pattern=${pattern}` : ""}`);
                    }
                }

                if (result) {
                    if (repeated && !(result.value instanceof Array)) {
                        result.value = [result.value];
                    }
                    else if (!repeated && result.value instanceof Array && result.value.every(value => typeof value === "string")) {
                        result.value = result.value.length > 0 ? result.value.join(format === "singleline" ? " " : "\n") : null; // concatenate strings
                    }
                    else if (!repeated && result.value instanceof Array) {
                        result.value = result.value[0]; // take first value
                    }
                    return result;
                }
            }
        }

        private queryCheck(query: SelectQuery[], on: SelectOn, pattern: string | undefined): [boolean, QueryResult | undefined] {
            const type = pattern ? "string" : "boolean";
            const all = on === "all";
            const result = this.query({ query, type, pattern, all, repeated: all });
            let pass = false;
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
            return [pass, result];
        }

        private async repeat({ name = "", actions, limit, errors = 1, when, active = true }: Repeat): Promise<void> {
            if (name)
                name = " " + name;
            if (limit === undefined)
                limit = 10;
            else if (typeof limit === "string")
                limit = this.evaluateNumber(limit);
            if (active) {
                if (this.when(when, `REPEAT${name}`)) {
                    const state = this.acquireRepeatState();
                    let errorOffset = 0;
                    while (state.index < limit) {
                        const label = `REPEAT${name} #${++state.index}`;
                        this.log(`${label} (limit=${limit})`);
                        const code = await this.run(actions, label, true);
                        if (!code) {
                            this.log(`${label} -> ${actions.length} steps completed`);
                            errorOffset = this.state.errors.length - state.errors;
                            if (errorOffset >= errors) {
                                this.appendError("error-limit", `${errorOffset} errors in repeat (error limit of ${errors} exceeded)`, 1);
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    this.clearRepeatState();
                    this.log(`REPEAT${name} ${state.index} iterations completed (limit=${limit}, errors=${errorOffset}/${errors})`);
                }
                else {
                    this.log(`REPEAT${name} SKIPPED ${when}`);
                }
            }
            else {
                this.log(`REPEAT${name} BYPASSED ${when}`);
            }
        }

        private acquireRepeatState(): RepeatState {
            const depth = this.state.vars.__step.length;
            if (!this.state.vars.__repeat[depth])
                this.state.vars.__repeat[depth] = {
                    index: 0,
                    errors: this.state.errors.length
                };
            return this.state.vars.__repeat[depth]!;
        }

        private clearRepeatState(): void {
            const depth = this.state.vars.__step.length;
            this.state.vars.__repeat[depth] = undefined;
        }

        private locator({ name, selector, actions, when }: Locator): void {
            this.yield({
                name: `LOCATOR ${name ? ` ${name}` : ""}`,
                params: {
                    locator: {
                        selector,
                        actions
                    }
                },
                when
            });
        }

        private resolveOperands(operands: unknown[], result: QueryResult): void {
            for (let i = 0; i < operands.length; ++i) {
                if (isFormula(operands[i]) || isRegexp(operands[i])) {
                    this.eachNode(result, (node, value) => {
                        const resolvedValue = String(this.evaluate(operands[i], { value }));
                        if (resolvedValue !== operands[i]) {
                            operands[i] = resolvedValue;
                        }
                    });
                }
            }
        }

        private resolveQuery({ query, type, repeated, all, limit, format, pattern, negate, removeNulls, result }: ResolveQueryParams): QueryResult | undefined {
            if (!(query instanceof Array)) {
                this.appendError("eval-error", "Invalid selector query, query is not an array", 0);
                return undefined;
            }

            const $ = this.jquery;
            let selector = query[0];
            const ops = query.slice(1) as SelectQueryOp[];
            const context = this.context();

            let nodes: JQueryResult;
            let value: unknown;
            if (typeof selector !== "string") {
                nodes = $();
                value = null;
                this.appendError("eval-error", "Invalid selector query, first element is not a string", 0);
            }
            else if (selector === "." && context) {
                nodes = $(context.nodes);
                value = context.value;
                this.log(`QUERY $(".", [${this.nodeKey(context.nodes)}]) -> ${trunc(value)} (${nodes.length} nodes)`);
            }
            else if (selector === ".." && context?.parent) {
                nodes = $(context.parent.nodes);
                value = context.parent.value;
                this.log(`QUERY $("..", [${this.nodeKey(context.nodes)}]) -> ${trunc(value)} (${nodes.length} nodes)`);
            }
            else if (selector.startsWith("^")) {
                let n = parseInt(selector.slice(1));
                let subcontext: SelectContext | undefined = n > 0 ? context : undefined;
                while (subcontext && n-- >= 0) {
                    subcontext = context.parent;
                }
                if (subcontext) {
                    nodes = $(subcontext.nodes);
                    value = subcontext.value;
                    this.log(`QUERY $(${selector}, [${this.nodeKey(context.nodes)}]) -> ${trunc(value)} (${nodes.length} nodes)`);    
                }
                else {
                    this.appendError("eval-error", `Invalid context for selector "${selector}"`, 0);
                    return undefined;
                }
            }
            else if (selector === "{window}") {
                nodes = this.online ? $(window) : $();
                value = null;
            }
            else if (selector === "{document}") {
                nodes = this.online ? $(document) : $();
                value = null;
            }
            else {
                try {
                    const _selector = String(this.evaluate(selector));
                    nodes = this.resolveQueryNodes($(_selector, context?.nodes), result?.nodes);
                    value = this.text(nodes, format);
                    if (selector !== _selector) {
                        this.log(`EVALUATE "${selector}" >>> "${_selector}"`);
                    }
                    this.log(`QUERY $("${_selector}", [${this.nodeKey(context.nodes)}]) -> ${trunc(value)} (${nodes.length} nodes)`);
                }
                catch (err) {
                    this.appendError("eval-error", `Failed to resolve selector for "${$statement(query)}": ${err instanceof Error ? err.message : JSON.stringify(err)}`, 0);
                    return undefined;
                }
            }

            if (ops.length > 0 && nodes.length > 0) {
                try {
                    return this.resolveQueryOps({ ops, nodes, type, repeated, all, limit, format, pattern, negate, removeNulls, value });
                }
                catch (err) {
                    this.appendError("eval-error", `Failed to resolve operation for "${$statement(query)}": ${err instanceof Error ? err.message : JSON.stringify(err)}`, 0);
                    return undefined;
                }
            }
            else if (type === "boolean") {
                // if type is boolean then result is based on whether the query resulted in any hits
                let value = !repeated ? nodes.length > 0 : [nodes.length > 0];
                if (negate) {
                    value = !value;
                }
                return {
                    nodes,
                    key: this.contextKey(),
                    value
                }
            }
            else if (nodes.length > 0) {
                return this.formatResult({ nodes, key: this.contextKey(), value }, type, all, limit, format, pattern, negate, removeNulls);
            }
            else {
                return undefined;
            }
        }

        private resolveQueryNodes(target: JQueryResult, result: JQueryResult | undefined) {
            const $ = this.jquery;
            if (result) {
                const source = result.toArray();
                const nodes = target.toArray().filter(node => !source.includes(node));
                return $(nodes);
            }
            else {
                return target;
            }
        }

        private resolveQueryOps({ ops, nodes, type, repeated, all, limit, format, pattern, negate, removeNulls, value }: ResolveQueryOpsParams): QueryResult {
            const $ = this.jquery;
            const result: QueryResult = { nodes, key: this.contextKey(), value };
            if (!this.validateOperators(ops)) {
                return result;
            }

            const a = ops.slice(0);
            while (a.length > 0) {
                const [operator, ...operands] = a.shift()!;
                if (operator === "blank") {
                    result.nodes = $(result.nodes.toArray().filter(element => $(element).text().trim().length === 0));
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
                    if (!this.validateOperands(operator, operands, ["string"], ["boolean","boolean"])) {
                        break;
                    }
                    const regexp = createRegExp(operands[0]);
                    const keepUnmatchedItems = operands[1] as boolean;
                    const trim = operands[2] as boolean ?? true;
                    if (!regexp) {
                        this.appendError("invalid-operand", `Invalid regular expression for "extract"`, 0);
                    }
                    else if (result.value instanceof Array && result.value.every(value => typeof value === "string")) {
                        const values = result.value.map(value => regexpExtract(value.trim(), regexp, trim));
                        if (!keepUnmatchedItems) {
                            const elements = result.nodes.toArray();
                            for (let i = result.value.length - 1; i >= 0; --i) {
                                if (values[i] === null) {
                                    elements.splice(i, 1);
                                    values.splice(i, 1);
                                }
                            }
                            result.nodes = $(elements);
                        }
                        result.value = values;
                    }
                    else if (typeof result.value === "string") {
                        result.value = regexpExtract(result.value.trim(), regexp, trim);
                    }
                    else {
                        result.value = null;
                    }
                }
                else if (operator === "filter" && (isFormula(operands[0]) || isRegexp(operands[0]))) {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        break;
                    }
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
                            const hit = this.evaluateBoolean(operands[0], { value: input.values[i], index: i, count: n });
                            if (hit) {
                                output.elements.push(input.elements[i]);
                                output.values.push(input.values[i]);
                            }
                        }
                        result.nodes = $(output.elements);
                        result.value = output.values;
                    }
                    else {
                        const hit = this.evaluateBoolean(operands[0], { value: result.value });
                        if (!hit) {
                            result.nodes = $([]);
                            result.value = null;
                        }
                    }
                }
                else if (operator === "html" && (operands[0] === "outer" || operands[0] === undefined)) {
                    if (this.online) {
                        result.value = result.nodes.toArray().map(element => element.outerHTML.trim());
                    }
                    else {
                        result.value = result.nodes.toArray().map(element => $.html(element).toString().trim());
                    }
                    if (typeof operands[1] === "boolean" ? operands[1] : true) {
                        result.value = formatHTML(result.value);
                        result.formatted = true;
                    }
                }
                else if (operator === "html" && operands[0] === "inner") {
                    result.value = result.nodes.toArray().map(element => $(element).html());
                    if (typeof operands[1] === "boolean" ? operands[1] : true) {
                        result.value = formatHTML(result.value);
                        result.formatted = true;
                    }
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
                    result.nodes = $(output.elements);
                    result.value = output.values;
                }
                else if (operator === "nonblank") {
                    result.nodes = $(result.nodes.toArray().filter(element => $(element).text().trim().length > 0));
                    result.value = this.text(result.nodes, format);
                }
                else if (operator === "replace") {
                    if (!this.validateOperands(operator, operands, ["string", "string"])) {
                        break;
                    }
                    const regexp = createRegExp(operands[0]);
                    if (!regexp) {
                        this.appendError("invalid-operand", `Invalid regular expression for "replace"`, 0);
                    }
                    else if (result.value instanceof Array && result.value.every(value => typeof value === "string")) {
                        result.value = result.value.map(value => regexpReplace(value, regexp, operands[1] as string));
                    }
                    else if (typeof result.value === "string") {
                        result.value = regexpReplace(result.value, regexp, operands[1] as string);
                    }
                }
                else if (operator === "replaceHTML") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        break;
                    }
                    this.eachNode(result, (node, value) => {
                        const content = String(this.evaluate(operands[0], { value }));
                        node.html(content);
                    });
                    result.value = null;
                }
                else if (operator === "replaceTag") {
                    if (!this.validateOperands(operator, operands, ["string"], ["boolean"])) {
                        break;
                    }
                    const newTag = String(this.evaluate(operands[0], { value: operands[0] }));
                    const keepProps = operands[1] as boolean ?? true;
                    this.eachNode(result, node => {
                        // adapted from https://stackoverflow.com/questions/918792/use-jquery-to-change-an-html-tag
                        const newNode = $(newTag);
                        if (keepProps) {
                            $merge(newNode, node);
                        }
                        node.wrapAll(newNode);
                        node.contents().unwrap();
                    });
                    result.value = null;
                }
                else if (operator === "replaceText") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        break;
                    }
                    this.eachNode(result, (node, value) => {
                        const content = String(this.evaluate(operands[0], { value }));
                        node.text(content);
                    });
                    result.value = null;
                }
                else if (operator === "replaceWith") {
                    if (!this.validateOperands(operator, operands, ["string"])) {
                        break;
                    }
                    this.eachNode(result, (node, value) => {
                        const content = String(this.evaluate(operands[0], { value }));
                        node.replaceWith(content);
                    });
                    result.value = null;
                }
                else if (operator === "reverse") {
                    if (!this.validateOperands(operator, operands, [], [])) {
                        break;
                    }
                    result.nodes = $(result.nodes.toArray().reverse());
                    result.value = this.text(result.nodes, format);
                }
                else if (operator === "scrollBottom") {
                    if (this.online) {
                        const y = result.nodes.scrollTop()! + result.nodes.height()!;
                        this.log(`scrollBottom ${result.nodes.scrollTop()} ${result.nodes.height()} ${y}`)
                        window.scrollTo(0, y);
                    }
                }
                else if (operator === "size") {
                    result.value = result.nodes.length;
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
                    result.formatted = false;
                }
                else if (["appendTo", "each", "prependTo", "insertBefore", "insertAfter", "replaceAll"].includes(operator)) {
                    this.appendError("invalid-operator", `Operator "${operator}" not supported`, 0);
                }
                else if (isInvocableFrom(result.nodes, operator)) {
                    this.resolveOperands(operands, result);
                    const delegate = result.nodes as unknown as JQueryDelegate;
                    const obj = delegate[operator](...operands);
                    if (isJQueryObject(obj)) {
                        result.nodes = obj;
                        result.value = this.text(result.nodes, format);
                        result.formatted = false;
                    }
                    else if (repeated) {
                        result.value = result.nodes.toArray().map(element => {
                            const delegate = $(element) as unknown as JQueryDelegate;
                            const obj = delegate[operator](...operands);
                            return obj;
                        });
                        result.formatted = false;
                    }
                    else {
                        result.value = obj;
                        result.formatted = false;
                    }
                }
                else {
                    this.appendError("invalid-operator", `Operator '${operator}' not found`, 0);
                    break;
                }
            }
            return this.formatResult(result, type, all, limit, format, pattern, negate, removeNulls);
        }

        async run(actions: Action[], label = "", wraparound = false): Promise<DispatchResult | undefined> {
            if (label)
                label += " ";

            const steps = actions.length;
            this.state.vars.__step.unshift(0); // push step state
            const j = this.runRestoreIndexFromYield(actions, label, wraparound);
            for (let i = j; i < actions.length; i++) {
                const action = actions[i];
                const step = i + 1;
                this.state.vars.__step[0] = step;
                const [key] = Object.keys(action);
                this.log(`${label}STEP #${step}/${steps} {${key}}`);
                const code = await this.dispatch(action, step);
                if (code) {
                    this.log(`${label}BREAK at step #${step}/${actions.length}, code=${code}`);
                    this.state.vars.__step.shift(); // pop step state
                    return code;
                }
            }
            this.state.vars.__step.shift(); // pop step state
            this.log(`${label}${steps} steps completed`);
        }

        runRestoreIndexFromYield(actions: Action[], label: string, wraparound: boolean): number {
            let index = 0;
            if (this.state.vars.__yield) {
                const step = this.state.vars.__yield.pop()!;
                if (step > actions.length && wraparound) {
                    this.log(`${label}YIELD wraparound to step #1/${actions.length}, index=${index}`);
                }
                else {
                    index = step - 1;
                    this.log(`${label}YIELD skipping to step #${step}/${actions.length}, index=${index}`);
                }
                if (this.state.vars.__yield.length === 0) {
                    this.state.vars.__yield = undefined; // clear the yield state
                    this.log(`${label}YIELD state cleared`);
                }
            }
            return index;
        }

        private async scroll({ name, query, target, behavior = "smooth", block, inline, when, active = true }: Scroll): Promise<void> {
            if (this.online && active) {
                if (this.when(when, `SCROLL${name ? ` ${name}` : ""}`)) {
                    if (target === "top" || target === "bottom") {
                        const top = target === "bottom" ? document.body.scrollHeight : 0;
                        const left = 0;
                        window.scrollTo({ top, left, behavior });
                        const w0 = [Math.floor(window.scrollX), Math.floor(window.scrollY)];
                        await waitForScrollEnd();
                        const w1 = [Math.floor(window.scrollX), Math.floor(window.scrollY)];
                        this.log(`SCROLL${name ? ` ${name}` : ""} ${when || "(default)"} scroll to ${target} from [${w0}] to [${w1}]`);
                    }
                    else if (query) {
                        const result = this.query({ query, repeated: false });
                        if (result && result.nodes.length > 0) {
                            const element = result.nodes[0] as Element;
                            const { top, left } = element.getBoundingClientRect();
                            const elementPos = [window.scrollX + Math.floor(left), window.scrollY + Math.floor(top)]
                            const w0 = [Math.floor(window.scrollX), Math.floor(window.scrollY)];
                            element.scrollIntoView({ behavior, block, inline });
                            await waitForScrollEnd();
                            const w1 = [Math.floor(window.scrollX), Math.floor(window.scrollY)];
                            this.log(`SCROLL${name ? ` ${name}` : ""} ${when || "(default)"} -> [${this.nodeKey(result.nodes)}] scroll to element at [${elementPos}] from [${w0}] to [${w1}]`);
                        }
                    }
                    else {
                        this.log(`SCROLL${name ? ` ${name}` : ""} ${when || "(default)"} INVALID TARGET`);
                    }
                }
                else {
                    this.log(`SCROLL${name ? ` ${name}` : ""} SKIPPED ${when}`);
                }
            }
            else {
                this.log(`SCROLL BYPASSED ${when}`);
            }
        }

        private select(selects: Select[], pivot = false): unknown {
            const data = {} as Record<string, DataItem | null>;
            for (const select of selects) {
                if (select.active ?? true) {
                    this.validateSelect(select);
                    let item: DataItem | null = null;
                    if (this.when(select.when)) {
                        if (select.pivot) {
                            item = this.selectResolvePivot(select, item);
                        }
                        else {
                            if (!pivot) {
                                this.pushContext({ name: select.name }, select.context);
                            }

                            if (select.union) {
                                item = this.selectResolveUnion(select, item, data);
                            }                        
                            else if (select.query) {
                                item = this.selectResolveSelector(select, item);
                            }
                            else if (select.value) {
                                item = this.selectResolveValue(select, data);
                            }
    
                            if (!pivot) {
                                if (isEmpty(item?.value) && select.required) {
                                    this.appendError("select-required", `Required select '${this.contextKey()}' not found`, 0);
                                }    
                                this.popContext();
                            }
                        }
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

        private selectResolvePivot(select: Select, item: DataItem | null): DataItem | null {
            const $ = this.jquery;
            const { pivot, ...superselect } = select;
            if (pivot) {
                const result = this.query(select);
                if (result && result.nodes && result.nodes.length > 0) {
                    this.pushContext({
                        name: select.name,
                        nodes: result.nodes,
                        value: result.value,
                        action: "pivot"
                    }, select.context);
                    const elements = result.nodes.toArray();
                    for (const element of elements) {
                        const nodes = $(element);
                        this.pushContext({
                            nodes: $(element),
                            value: this.text(nodes, select.format),
                            pivot: elements.indexOf(element)
                        }, select.context);
                        item = this.selectResolveSelector({ ...superselect, ...pivot }, item, true);
                        this.log(`PIVOT ${this.contextKey()} -> ${typeName(item?.value)}`);
                        this.popContext();
                    }
                    if (isEmpty(item?.value) && select.required) {
                        this.appendError("select-required", `Required select '${this.contextKey()}' not found`, 0);
                    }
                    this.popContext();
                }
                else {
                    this.log(`PIVOT ${this.contextKey()} EMPTY`);
                }
            }
            return item;
        }

        private selectResolveSelector(select: Select, item: DataItem | null, pivot = false): DataItem | null {
            const $ = this.jquery;
            let subitem: DataItem | null = null;
            // if select type is unspecified then default to "object" if there is a subselect
            if (select.type === undefined && select.select) {
                select.type = "object";
            }
            const result = this.query(select);
            if (result) {
                if (select.type !== "object") {
                    subitem = {
                        nodes: this.nodeKeys(result.nodes),
                        key: result.key,
                        value: result.value
                    };
                }
                else if (select.select) {
                    this.pushContext({ action: "subselect" }, select.context);
                    const n = result.value instanceof Array ? result.value.length : 0;
                    if (select.repeated && result.nodes.length === n && !select.collate) {
                        // select by nodes
                        subitem = {
                            nodes: this.nodeKeys(result.nodes),
                            key: result.key,
                            value: result.nodes.toArray().map((node, index) => {
                                this.pokeContext({
                                    nodes: $(node),
                                    value: result.value instanceof Array ? result.value[index] : result.value,
                                    index
                                });
                                return this.select(select.select!, pivot);
                            })
                        };
                    }
                    else if (select.repeated && result.value instanceof Array && !select.collate) {
                        // select by values (this is common when using split)
                        subitem = {
                            nodes: this.nodeKeys(result.nodes),
                            key: result.key,
                            value: result.value.map((value, index) => {
                                this.pokeContext({
                                    nodes: result.nodes,
                                    value,
                                    index
                                });
                                return this.select(select.select!, pivot);
                            })
                        };
                    }
                    else {
                        this.pokeContext({
                            nodes: result.nodes,
                            value: result.value,
                        });
                        // if collate is true force all to true for each subselect so all node values are included with each subselect
                        const subselect = select.collate ? select.select.map(obj => ({ ...obj, all: true })) : select.select;
                        const value = this.select(subselect, pivot);
                        subitem = {
                            nodes: this.nodeKeys(result.nodes),
                            key: result.key,
                            value: select.repeated ? [value] : value
                        };
                    }
                    this.popContext();
                }
            }
            this.log(`SELECT ${this.contextKey()} -> ${$statements(select.query)} -> ${subitem ? trunc(subitem.value) : "(none)"}${item ? ` merge(${typeName(item?.value)}, ${typeName(subitem?.value)})` : ""}`);
            return merge(item, subitem);
        }

        private selectResolveUnion(select: Select, item: DataItem | null, data: unknown): DataItem | null {
            const { union, ...superselect } = select;
            if (union) {
                for (const subselect of union) {
                    if (subselect.active ?? true) {
                        if (this.when(subselect.when)) {
                            this.pokeContext({
                                action: "union",
                                union: union.indexOf(subselect)
                            });
                            this.log(`UNION ${this.contextKey()} ${union.indexOf(subselect) + 1}/${union.length}`);
                            if (subselect.pivot) {
                                item = this.selectResolvePivot({ ...superselect, ...subselect }, item);
                            }
                            else if (subselect.query) {
                                item = this.selectResolveSelector({ ...superselect, ...subselect }, item);
                            }
                            else if (subselect.value) {
                                item = this.selectResolveValue(subselect);
                            }
                        }
                        else {
                            this.log(`UNION SKIPPED ${this.contextKey()} ${union.indexOf(subselect) + 1}/${union.length}`);
                        }
                    }
                    else {
                        this.log(`UNION BYPASSED ${this.contextKey()} ${union.indexOf(subselect) + 1}/${union.length}`);
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
                key: this.contextKey(),
                value: select.repeated ? [value] : value
            };
        }

        private async snooze(interval: Snooze): Promise<void> {
            this.log(`SNOOZE ${interval[0]}s`);
            await sleep(interval[0] * 1000);
        }

        private async switch(switches: Switch[]): Promise<void> {
            let i = 0;
            for (const { when, name, query, actions } of switches) {
                const label = `SWITCH CASE ${++i}/${switches.length}${name ? ` ${name}` : ""}`;
                if (this.when(when, label)) {
                    const result = query ? this.query({ query, type: "boolean", repeated: false }) : { value: true };
                    if (result?.value === true) {
                        this.log(`${label} SELECTED`);
                        await this.run(actions, label, true);
                        return;
                    }
                    else {
                        this.log(`${label} SKIPPED`);
                    }
                }
            }
            this.log("SWITCH: NONE SELECTED");
        }

        private text(nodes: JQuery<HTMLElement>, format?: SelectFormat): string[] {
            const $ = this.jquery;
            format = format?.toLowerCase() as SelectFormat;
            if (this.online && format === "innertext") {
                return nodes.toArray().map(element => element.innerText);
            }
            else if (this.online && format === "textcontent") {
                return nodes.toArray().map(element => element.textContent as string);
            }
            else if (format === "none") {
                return nodes.toArray().map(element => $(element).text());
            }
            else {
                // add whitespace after nodes https://stackoverflow.com/questions/32635444/alternative-to-jquery-text-that-includes-spaces-between-elements
                // a<i>b</i>c -> a b c 
                nodes.find("*").each((index, element) => {
                    const node = $(element);
                    const tag = node.prop("tagName").toLowerCase();
                    const whitespace = tag === "br" || tag === "p" ? "\n" : " ";
                    node.append(whitespace);
                    if (index === 0) {
                        node.prepend(" ");
                    }
                });
                return nodes.toArray().map(element => $(element).text().trim().replace(/[ ]{2,}/g, " "));
            }
        }

        private async transform(transforms: Transform[]): Promise<void> {
            for (const transform of transforms) {
                if (transform.active ?? true) {
                    if (this.when(transform.when, `TRANSFORM${transform.name ? ` ${transform.name}` : ""}`)) {
                        const query = transform.query;
                        const selector = query[0];
                        const [operands] = query.slice(1) as SelectQueryOp[];
                        if (selector === "{window}" && operands[0] === "scrollBottom") {
                            const delay = typeof operands[1] === "number" ? operands[1] : undefined;
                            const max = typeof operands[2] === "number" ? operands[2] : undefined;
                            const pagedowns = await $scrollToBottom(delay, max);
                            this.log(`TRANSFORM${transform.name ? ` ${transform.name}` : ""} ${$statement(query)} (${pagedowns}x)`);
                        }
                        else {
                            try {
                                const result = this.resolveQuery({ query, repeated: true, all: true, limit: null });
                                this.log(`TRANSFORM${transform.name ? ` ${transform.name}` : ""} ${$statement(query)} -> (${result?.nodes?.length || 0} nodes)`);
                            }
                            catch (err) {
                                this.log(`TRANSFORM${transform.name ? ` ${transform.name}` : ""} ERROR ${$statement(query)}: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
                            }
                        }
                    }
                    else {
                        this.log(`TRANSFORM${transform.name ? ` ${transform.name}` : ""} SKIPPED ${$statement(transform.query)}`);
                    }
                }
                else {
                    this.log(`TRANSFORM${transform.name ? ` ${transform.name}` : ""} BYPASSED ${$statement(transform.query)}`);
                }    
            }
        }

        private validateOperands(operator: SelectQueryOperator, operands: SelectQueryOperand[], required: Array<"string" | "number" | "boolean">, optional: Array<"string" | "number" | "boolean"> = []): boolean {
            for (let i = 0; i < required.length; ++i) {
                if (typeof operands[i] !== required[i]) {
                    this.appendError("invalid-operand", `Operand #${i + 1} of "${operator}" is invalid: "${operands[i]}" is not a ${required[i]}`, 0);
                    return false;
                }
            }
            for (let i = 0; i < optional.length; ++i) {
                const j = i + required.length;
                if (operands[j] !== undefined && operands[j] !== null && typeof operands[j] !== optional[i]) {
                    this.appendError("invalid-operand", `Operand #${j + 1} of "${operator}" is invalid: "${operands[j]}" is not a ${optional[i]}`, 0);
                    return false;
                }
            }
            return true;
        }

        private validateOperators(ops: SelectQueryOp[]): boolean {
            const valid = ops instanceof Array && ops.every(op => op instanceof Array && op.length > 0 && typeof op[0] === "string");
            if (!valid) {
                this.appendError("invalid-operator", `Invalid operator in: ${JSON.stringify(ops)}`, 0);
            }
            return valid;
        }

        private validateSelect(select: Select): boolean {
            const n = (select.query !== undefined ? 1 : 0) + (select.union !== undefined ? 1 : 0) + (select.value !== undefined ? 1 : 0);
            if (n !== 1) {
                this.appendError("invalid-select", "Select requires one of 'query', 'union', or 'value'", 0);
                return false;
            }
            else {
                return true;
            }
        }

        private async waitfor({ name, query, select, timeout, on = "any", required, pattern, when, active = true }: WaitFor, label = ""): Promise<"timeout" | "invalid" | null> {
            if (label)
                label += " ";
            if (this.online && active) {
                if (this.when(when, `WAITFOR${name ? ` ${name}` : ""}`)) {
                    if (timeout === undefined) {
                        timeout = 30;
                    }
                    else if (timeout === null || timeout <= 0) {
                        timeout = Infinity;
                    }
        
                    let code = null;
                    if (query) {
                        this.log(`${label}WAITFOR${name ? ` ${name}` : ""} QUERY ${trunc(query)} on=${on}, timeout=${timeout}, pattern=${pattern}`);
                        code = await this.waitforQuery(query, on, timeout, required, pattern, label);
                    }
                    else if (select) {
                        this.log(`${label}WAITFOR${name ? ` ${name}` : ""} SELECT ${trunc(select)} on=${on}, timeout=${timeout}, pattern=${pattern}`);
                        code = await this.waitforSelect(select, on, timeout, required, pattern, label);
                    }
                    return code;
                }
                else {
                    this.log(`${label}WAITFOR${name ? ` ${name}` : ""} BYPASSSED ${$statements(query)}`);
                    return null;
                }
            }
            else {
                this.log(`${label}WAITFOR${name ? ` ${name}` : ""} SKIPPED ${$statements(query)}`);
                return null;
            }
        }

        private async waitforQuery(query: SelectQuery[], on: SelectOn, timeout: number, required: boolean | undefined, pattern: string | undefined, label = ""): Promise<"timeout" | null> {
            if (label)
                label += " ";
            const t0 = new Date().valueOf();
            let elapsed = 0;
            let pass = false;
            let result = undefined;
            while (!pass && elapsed < timeout) {
                [pass, result] = this.queryCheck(query, on, pattern);
                if (!pass) {
                    await sleep(100);
                }
                elapsed = (new Date().valueOf() - t0) / 1000;
            }

            const message = `${label}WAITFOR QUERY ${$statements(query)} -> ${trunc(result?.value)}${pattern ? ` (valid=${result?.valid})` : ""} -> on=${on} -> ${pass} (${elapsed.toFixed(1)}s${elapsed > timeout ? " TIMEOUT": ""})`;
            this.log(message);
            if (pass) {
                return null;
            }
            else if (required) {
                this.appendError("waitfor-timeout", message, 1);
                return "timeout";
            }
            else {
                return null;
            }
        }

        private async waitforSelect(selects: Select[], on: SelectOn, timeout: number, required: boolean | undefined, pattern: string | undefined, label = ""): Promise<"timeout" | "invalid" | null> {
            if (label)
                label += " ";
            for (const select of selects) {
                if (!select.name || !select.name.startsWith("_") || !(!select.type || select.type === "boolean") || select.repeated) {
                    this.appendError("invalid-select", "waitfor select must all be internal, boolean, and not repeated", 0);
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

            const message = `${label}WAITFOR SELECT ${JSON.stringify(state)}${pattern ? "valid=???" : ""} -> on=${on} -> ${pass} (${elapsed.toFixed(1)}s${elapsed > timeout ? " TIMEOUT": ""})`;
            this.log(message);
            if (pass) {
                return null;
            }
            else if (required) {
                this.appendError("waitfor-timeout", message, 1);
                return "timeout";
            }
            else {
                return null;
            }
        }

        private when(when: When | undefined, label = ""): boolean {
            if (label)
                label += " ";
            if (when) {
                try {
                    const result = !!this.evaluate(when);
                    this.log(`${label}WHEN ${JSON.stringify(when)} -> ${result}`);
                    return result;
                }
                catch (err) {
                    this.log(`${label}WHEN ${JSON.stringify(when)} -> ERROR ${err instanceof Error ? err.message : JSON.stringify(err)}`);
                    return false;
                }
            }
            return true;
        }

        private yield({ name = "", params, when, active = true }: Yield): void {
            if (name)
                name = " " + name;
            if (this.online && active) {
                if (this.when(when, `YIELD${name}`)) {
                    this.state.vars.__step[0] += 1; // advance to next step on re-entry
                    const step = this.state.vars.__step;
                    this.log(`YIELD${name} step=${JSON.stringify(step)} params=${JSON.stringify(params || {})}`);
                    this.state.yield = { step, params };
                    throw "YIELD";
                }
                else {
                    this.log(`YIELD${name} SKIPPED ${when}`);
                }
            }
            else {
                this.log(`YIELD${name} BYPASSED ${when}`);
            }
            return undefined;
        }
    }

    if (typeof state?.vars?.__instance === "number") {
        state.vars.__instance += 1;
    }
    const obj = new ExtractContext(state);
    obj.log(`ENTRY #${obj.state.vars.__instance}${obj.online ? ` ${window.location.href}` : ""}`);

    try {
        await obj.run(obj.state.actions);
        obj.log("EXIT");
    }
    catch (err) {
        if (err === "YIELD") {
            obj.log("YIELDING");
        }
        else if (err === "STOP") {
            obj.log("STOPPED");
        }
        else {
            obj.appendError("fatal-error", err instanceof Error ? err.message : JSON.stringify(err), 0, err instanceof Error ? err.stack : undefined);
        }
    }
    return obj.state;
}