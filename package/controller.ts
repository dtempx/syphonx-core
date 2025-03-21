const defaultTimeoutSeconds = 30; // seconds

import { CheerioAPI } from "cheerio";
import { errorCodeMessageMap } from "./errors.js";

import {
    Action,
    Break,
    BreakAction,
    Click,
    ClickAction,
    Each,
    EachAction,
    Error,
    ErrorAction,
    ExtractErrorCode,
    ExtractState,
    ExtractStatus,
    GoBack,
    GoBackAction,
    KeyPress,
    KeyPressAction,
    Locator,
    LocatorAction,
    LocatorMethod,
    Navigate,
    NavigateAction,
    Reload,
    ReloadAction,
    Repeat,
    RepeatAction,
    Screenshot,
    ScreenshotAction,
    Scroll,
    ScrollAction,
    Select,
    SelectAction,
    SelectFormat,
    SelectOn,
    SelectQuery,
    SelectQueryOp,
    SelectQueryOperand,
    SelectQueryOperator,
    SelectType,
    Snooze,
    SnoozeAction,
    Switch,
    SwitchAction,
    Transform,
    TransformAction,
    WaitFor,
    WaitForAction,
    When,
    Yield,
    YieldAction
} from "./public";

import {
    DataItem,
    DispatchResult,
    ExtractStateInternal,
    JQueryDelegate,
    JQueryResult,
    QueryParams,
    QueryResult,
    RepeatState,
    ResolveQueryOpsParams,
    ResolveQueryParams,
    SelectContext
} from "./private";

import {
    coerce,
    coerceSelectValue,
    createRegExp,
    cut,
    evaluateFormula,
    evaluateXPath,
    filterQueryResult,
    formatHTML,
    formatStringValue,
    isCoercibleTo,
    isEmpty,
    isFormula,
    isInvocableFrom,
    isJQueryObject,
    isNullOrUndefined,
    isRegexp,
    merge,
    mergeElements,
    parseBoolean,
    parseUrl,
    regexpExtract,
    regexpExtractAll,
    regexpReplace,
    regexpTest,
    selectorStatement,
    selectorStatements,
    sleep,
    trim,
    trunc,
    tryParseJson,
    typeName,
    unwrap,
    waitForScrollEnd,
    Timer
} from "./lib/index.js";

export class Controller {
    jquery: JQueryStatic & CheerioAPI;
    state: ExtractStateInternal;
    online: boolean;
    lastLogLine = "";
    lastLogLength = 0;
    lastLogTimestamp = 0;
    lastStep: number[] = [];
    step: number[] = [];

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

        const version = "";
        this.state = {
            params: {},
            errors: [],
            log: "",
            ...state, // may include params, data, log, errors, debug, root
            yield: undefined, // yield state discarded on re-entry
            vars: {
                // initialize or carry over from previous instance
                __instance: 0,
                __context: [],
                __metrics: {} as unknown,
                __repeat: {},
                __t0: Date.now(),
                __timeout: state.timeout || defaultTimeoutSeconds,

                ...state.vars,

                // initialize fresh on every instance
                __step: [], 
                __yield: state.yield?.step
            },
            domain,
            origin,
            version
        } as ExtractStateInternal;

        // ensure all metrics are initialized, allowing any existing values to take precedence
        this.state.vars.__metrics = {
            actions: 0,
            clicks: 0,
            elapsed: 0,
            errors: 0,
            navigate: 0,
            queries: 0,
            renavigations: 0,
            retries: 0,
            skipped: 0,
            snooze: 0,
            steps: 0,
            timeouts: 0,
            waitfor: 0,
            yields: 0,
            ...state.vars?.__metrics!
        };

        // set select context for synchronous calls
        if (this.state.context) {
            const $ = this.jquery;
            const nodes = $(this.state.context);
            const value = this.text(nodes);
            this.state.vars.__context = [{ name: "context", nodes, value }];
        }
    }

    appendError(code: ExtractErrorCode, message: string, level: number, stack?: string): void {
        const key = this.contextKey();
        this.state.errors.push({ code, message, key, level, stack });
        const text = `ERROR ${key ? `${key}: ` : ""}${message} code=${code} level=${level}${stack ? `\n${stack}` : ""}`
        this.log(text);
    }

    private break({ name = "", query, on = "any", pattern, when }: Break): boolean {
        if (name)
            name = " " + name;
        if (this.online) {
            if (this.when(when, "BREAK")) {
                this.state.vars.__metrics.steps += 1;
                if (query) {
                    this.log(`BREAK${name} WAITFOR QUERY ${trunc($)} on=${on}, pattern=${pattern}`);
                    const [pass, result] = this.queryCheck(query, on, pattern);
                    this.log(`BREAK${name} QUERY ${selectorStatements(query)} -> ${trunc(result?.value)}${pattern ? ` (valid=${result?.valid})` : ""} -> on=${on} -> ${pass}`);
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
                this.state.vars.__metrics.skipped += 1;
                this.log(`BREAK${name} SKIPPED ${when}`);
            }
        }
        else {
            this.log(`BREAK${name ? ` ${name}` : ""} BYPASSED ${when}`);
        }
        return false;
    }

    private async click({ name, query, waitfor, snooze, required, retry, when, ...options }: Click): Promise<DispatchResult> {
        if (this.online) {
            if (this.when(when, `CLICK${name ? ` ${name}` : ""}`)) {
                const mode = snooze ? snooze[2] || "before" : undefined;
                if (snooze && (mode === "before" || mode === "before-and-after")) {
                    const duration = this.maxTimeout(snooze[0]);
                    this.log(`CLICK${name ? ` ${name}` : ""} SNOOZE BEFORE (${duration.toFixed(1)}s) ${selectorStatements(query)}`);
                    await sleep(duration);
                    this.state.vars.__metrics.snooze += duration;
                }
                const result = this.query({ query });
                if (result && result.nodes.length > 0) {
                    if (this.clickElement(result.nodes[0], selectorStatements(query))) {
                        if (waitfor) {
                            const code = await this.waitfor(waitfor, "CLICK");
                            if (!code) {
                                if (snooze && (mode === "after" || mode === "before-and-after")) {
                                    const duration = this.maxTimeout(snooze[0]);
                                    this.log(`CLICK${name ? ` ${name}` : ""} SNOOZE AFTER (${duration.toFixed(1)}s) ${selectorStatements(query)}`);
                                    await sleep(duration);                
                                    this.state.vars.__metrics.snooze += duration;
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
                        else if (options.yield) {
                            this.yield({
                                name: `CLICK ${name ? ` ${name}` : ""}`,
                                params: {
                                    click: {},
                                    waitUntil: options.waitUntil
                                }
                            });
                        }
                        this.state.vars.__metrics.clicks += 1;
                        this.state.vars.__metrics.steps += 1;
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
                this.state.vars.__metrics.skipped += 1;
                this.log(`CLICK${name ? ` ${name}` : ""} SKIPPED ${selectorStatements(query)}`);
            }
        }
        else {
            this.log(`CLICK${name ? ` ${name}` : ""} IGNORED ${selectorStatements(query)}`);
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

    private async dispatch(action: Action): Promise<DispatchResult> {
        if (action.hasOwnProperty("select")) {
            const select = (action as SelectAction).select;
            const code = await this.selectWaitfor(select);
            if (code === "timeout")
                return "timeout";
            const data = this.select(select);
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
        else if (action.hasOwnProperty("goback")) {
            await this.goback((action as GoBackAction).goback);
        }
        else if (action.hasOwnProperty("keypress")) {
            this.keypress((action as KeyPressAction).keypress);
        }
        else if (action.hasOwnProperty("locator")) {
            await this.locator((action as LocatorAction).locator);
        }
        else if (action.hasOwnProperty("navigate")) {
            await this.navigate((action as NavigateAction).navigate);
        }
        else if (action.hasOwnProperty("reload")) {
            await this.reload((action as ReloadAction).reload);
        }
        else if (action.hasOwnProperty("repeat")) {
            await this.repeat((action as RepeatAction).repeat);
        }
        else if (action.hasOwnProperty("screenshot")) {
            await this.screenshot((action as ScreenshotAction).screenshot);
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
            this.transform((action as TransformAction).transform);
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

    private async each({ name, query, actions, context, when }: Each): Promise<void> {
        const $ = this.jquery;
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
            this.state.vars.__metrics.steps += 1;
        }
        else {
            this.state.vars.__metrics.skipped += 1;
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

    private elapsed(): number {
        return Date.now() - this.state.vars.__t0;
    }

    private error({ query, code = "app-error", message, level = 1, negate, stop, when }: Error): void {
        if (!message)
            message = errorCodeMessageMap[code] || "Unknown error.";
        if (query) {
            const result = this.query({ query, type: "boolean", repeated: false });
            const hit = !negate ? result?.value === false : result?.value === true;
            if (hit) {
                this.appendError(code, String(this.evaluate(message)), level);
                this.state.vars.__metrics.steps += 1;
                if (stop === true || (stop === undefined && level === 0))
                    throw "STOP";
            }
        }
        else if (this.when(when, "ERROR")) {
            this.appendError(code, String(this.evaluate(message)), level);
            this.state.vars.__metrics.steps += 1;
            if (stop === true || (stop === undefined && level === 0))
                throw "STOP";
        }
        else {
            this.state.vars.__metrics.skipped += 1;
            this.log(`ERROR ${code} SKIPPED ${when}`);
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
                data: unwrap(merge(this.state.data, data)),
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

    private evaluateBoolean(input: unknown, params: Record<string, unknown> = {}): boolean | undefined {
        if (input !== undefined && input !== null) {
            if (isRegexp(input)) {
                const result = regexpTest(params.value as string, input as string);
                return result !== null ? result : undefined;
            }
            else {
                const result = this.evaluate(input, params);
                if (typeof result === "boolean")
                    return result;
            }
        }
        return undefined;
    }

    private evaluateNumber(input: unknown, params: Record<string, unknown> = {}): number | undefined {
        if (input !== undefined && input !== null) {
            const result = this.evaluate(input, params);
            if (typeof result === "number")
                return result;    
        }
        return undefined;
    }

    private evaluateString(input: unknown, params: Record<string, unknown> = {}): string | undefined {
        if (input !== undefined && input !== null) {
            const result = this.evaluate(input, params);
            if (typeof result === "string")
                return result;    
        }
        return undefined;
    }

    private formatResult(result: QueryResult, type: SelectType | undefined, all: boolean, limit: number | null | undefined, format: SelectFormat = "multiline", pattern: string | undefined, distinct: boolean | undefined, negate: boolean | undefined, removeNulls: boolean | undefined): QueryResult {
        const $ = this.jquery;
        const regexp = createRegExp(pattern);

        if (result.raw)
            return result;

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
                result.value = result.value.map(value => formatStringValue(coerceSelectValue(value, "string") as string, format, this.state.origin));
            }
            if (regexp && !isEmpty(result.value)) {
                result.valid = (result.value as string[]).every(value => regexp.test(value));
            }
        }
        else if (type === "string") {
            if (!result.formatted) {
                result.value = formatStringValue(coerceSelectValue(result.value, "string") as string, format, this.state.origin);
            }
            if (regexp && !isEmpty(result.value)) {
                result.valid = regexp.test(result.value as string);
            }
        }
        else if (type === "boolean" && result.value instanceof Array && result.value.length === 0) {
            result.value = false;
        }
        else if (type === "boolean" && result.value instanceof Array && all) {
            result.value = result.value.every(value => coerceSelectValue(value, "boolean") === true); // and all booleans together
        }
        else if (type === "boolean" && result.value instanceof Array && !all) {
            result.value = result.value.some(value => coerceSelectValue(value, "boolean") === true); // or all booleans together
        }
        else if (type === "boolean") {
            result.value = coerceSelectValue(result.value, "boolean");
        }
        else if (type === "number" && result.value instanceof Array) {
            result.value = result.value.map(value => coerceSelectValue(value, "number"));
        }
        else if (type === "number") {
            result.value = coerceSelectValue(result.value, "number");
        }

        if (negate) {
            if (typeof result.value === "boolean")
                result.value = !result.value;
            else if (result.value instanceof Array && result.value.every(value => typeof value === "boolean"))
                result.value = result.value.map(value => !value);
        }

        if (removeNulls && result.value instanceof Array) {
            filterQueryResult($, result, value => value !== null);
        }

        if (distinct && result.value instanceof Array) {
            filterQueryResult($, result, (value, index, array) => array.indexOf(value) === index);
        }

        return result;
    }

    private goback({ name, when }: GoBack): void {
        this.yield({
            name: `GOBACK ${name ? ` ${name}` : ""}`,
            params: {
                goback: {},
                action: "goBack" // legacy shim
            },
            when
        });
    }

    private keypress({ name = "", key, shift, control, alt, when }: KeyPress): void {
        if (name)
            name = " " + name;
        if (this.online) {
            if (this.when(when, "KEYPRESS")) {
                const event = new KeyboardEvent("keydown", {
                    key,
                    code: 'Key' + key.toUpperCase(),
                    keyCode: key.charCodeAt(0),
                    which: key.charCodeAt(0),
                    shiftKey: shift,
                    ctrlKey: control,
                    altKey: alt
                });
                document.dispatchEvent(event);
            }
            else {
                this.state.vars.__metrics.skipped += 1;
                this.log(`KEYPRESS${name} SKIPPED ${when}`);
            }
        }
        else {
            this.log(`KEYPRESS${name ? ` ${name}` : ""} BYPASSED ${when}`);
        }
    }

    log(text: string): void {
        if (this.state.debug) {
            // if the last line is repeated then append elapsed time to the end
            if (this.lastLogLine === text) {
                const elapsed = (Date.now() - this.lastLogTimestamp) / 1000;
                this.state.log = `${this.state.log.slice(0, this.lastLogLength)}${text} (${elapsed.toFixed(1)}s)\n`;
            }
            else {
                this.lastLogLine = text;
                this.lastLogLength = this.state.log.length;
                this.lastLogTimestamp = Date.now();
                this.state.log += `${String(this.elapsed()).padStart(8, "0")} ${text}\n`;
            }
        }
    }

    private maxTimeout(seconds = defaultTimeoutSeconds): number {
        const elapsed = this.elapsed() / 1000;
        const remaining = Math.max(this.state.vars.__timeout - elapsed, 0);
        return Math.min(seconds, remaining);
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
            const tag = element.tagName?.toLowerCase();
            const id = $(element).attr('id') || "";
            const className = $(element).attr('class')?.split(' ')[0] || "";
            const n = $(element).index() + 1;

            const uniqueId = /^[A-Za-z0-9_-]+$/.test(id) ? $(`#${id}`).length === 1 : false;
            const uniqueClassName = tag && /^[A-Za-z0-9_-]+$/.test(className) ? $(`${tag}.${className}`).length === 1 : false;
            const onlyTag = $parent.children(tag).length === 1;
            const onlyClassName = tag && /^[A-Za-z0-9_-]+$/.test(className) ? $parent.children(`${tag}.${className}`).length === 1 : false;

            if (uniqueId)
                path.push(`#${id}`);
            else if (uniqueClassName)
                path.push(`${tag}.${className}`);
            else if (onlyTag)
                path.push(tag);
            else if (onlyClassName)
                path.push(`${tag}.${className}`);
            else
                path.push(`${tag}:nth-child(${n})`);
                //path.push(n === 1 ? `${tag}:first-child` : n === $parent.length ? `${tag}:last-child` : `${tag}:nth-child(${n})`);

            if (uniqueId || uniqueClassName)
                break;
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

    private query({ query, type, repeated = false, all = false, format, pattern, limit, hits, distinct, negate, removeNulls }: QueryParams): QueryResult | undefined {
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
                const subresult = this.resolveQuery({ query: stage, type, repeated, all, limit, format, pattern, distinct, negate, removeNulls, result });
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

            if (result && !result.raw) {
                // guarantee the shape of the output data matches the repeated flag
                if (repeated && !Array.isArray(result.value))
                    result.value = [result.value];
                else if (!repeated && Array.isArray(result.value) && result.value.every(value => typeof value === "string"))
                    result.value = result.value.length > 0 ? result.value.join(format === "singleline" ? " " : "\n") : null; // concatenate strings
                else if (!repeated && type === "boolean" && !negate && Array.isArray(result.value) && result.value.every(value => typeof value === "boolean"))
                    result.value = result.value.some(value => value === true); // for type=boolean if any value is true then the result is true
                else if (!repeated && type === "boolean" && negate && Array.isArray(result.value) && result.value.every(value => typeof value === "boolean"))
                    result.value = !(result.value.some(value => value === false)); // for type=boolean with negate
                else if (!repeated && Array.isArray(result.value))
                    result.value = result.value[0]; // take first value
            }
            return result;
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

    private reload({ name, waitUntil, when }: Reload): void {
        this.yield({
            name: `RELOAD ${name ? ` ${name}` : ""}`,
            params: {
                reload: {},
                action: "reload", // legacy shim
                waitUntil
            },
            when
        });
    }

    private async repeat({ name = "", actions, limit, errors = 1, when }: Repeat): Promise<void> {
        if (name)
            name = " " + name;
        limit = this.evaluateNumber(limit);
        if (limit === undefined)
            limit = 1;
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
            this.state.vars.__metrics.steps += 1;
            this.log(`REPEAT${name} ${state.index} iterations completed (limit=${limit}, errors=${errorOffset}/${errors})`);
        }
        else {
            this.state.vars.__metrics.skipped += 1;
            this.log(`REPEAT${name} SKIPPED ${when}`);
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

    private locator(locators: Locator[]): void {
        const activeLocators = locators.filter(locator => 
            this.when(locator.when, `LOCATOR${locator.name ? ` ${locator.name}` : ""}`));
        if (activeLocators.length > 0) {
            const [locator] = activeLocators;
            this.yield({
                name: `LOCATOR ${locator.name ? ` ${locator.name}` : ""}${activeLocators.length > 1 ? ` (+${activeLocators.length - 1} more)`: ""}`,
                params: {
                    locators: activeLocators.map(locator => ({
                        name: this.evaluateString(locator.name) || "_value",
                        selector: this.evaluateString(locator.selector)!,
                        method: this.evaluateString(locator.method) as LocatorMethod,
                        params: locator.params?.map(param => this.evaluate(param)),
                        frame: this.evaluateString(locator.frame),
                        promote: locator.promote,
                        chain: locator.chain
                    })),
                    action: "locator", // legacy shim (only supports a single locator)
                    name: locator.name, // legacy shim
                    frame: locator.frame, // legacy shim
                    selector: locator.selector, // legacy shim
                    promote: locator.promote, // legacy shim
                    method: locator.method, // legacy shim
                    arg0: locator.params ? locator.params[0] : undefined // legacy shim
                }
            });
        }
    }

    private navigate({ name, url, waitUntil, when }: Navigate): void {
        this.yield({
            name: `NAVIGATE ${name ? ` ${name}` : ""} ${url}`,
            params: {
                navigate: { url: this.evaluateString(url)! },
                action: "navigate", // legacy shim
                url, // legacy shim
                waitUntil
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

    private resolveQuery({ query, type, repeated, all, limit, format, pattern, distinct, negate, removeNulls, result }: ResolveQueryParams): QueryResult | undefined {
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
            this.state.vars.__metrics.queries += 1;
            this.log(`QUERY $(".", [${this.nodeKey(context.nodes)}]) -> ${trunc(value)} (${nodes.length} nodes)`);
        }
        else if (selector === ".." && context?.parent) {
            nodes = $(context.parent.nodes);
            value = context.parent.value;
            this.state.vars.__metrics.queries += 1;
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
                this.state.vars.__metrics.queries += 1;
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
            this.state.vars.__metrics.queries += 1;
        }
        else if (selector === "{document}") {
            nodes = this.online ? $(document) : $();
            value = null;
            this.state.vars.__metrics.queries += 1;
        }
        else if (selector.startsWith("/") || selector.toLowerCase().startsWith("xpath:")) {
            if (!this.online) {
                this.appendError("eval-error", "XPATH selectors are only valid online", 0);
                return undefined;
            }
            const xpath = selector.toLowerCase().startsWith("xpath:") ? selector.slice(6) : selector;
            const xpath_nodes: Node[] = context.nodes ? context.nodes.toArray() : [document];
            const eval_result = evaluateXPath(xpath, xpath_nodes);
            nodes = $(eval_result.nodes);
            value = eval_result.value;
        }
        else {
            try {
                const _selector = String(this.evaluate(selector));
                nodes = this.resolveQueryNodes($(_selector, context?.nodes), result?.nodes);
                value = this.text(nodes, format);
                if (selector !== _selector)
                    this.log(`EVALUATE "${selector}" >>> "${_selector}"`);
                this.state.vars.__metrics.queries += 1;
                this.log(`QUERY $("${_selector}", [${this.nodeKey(context.nodes)}]) -> ${trunc(value)} (${nodes.length} nodes)`);
            }
            catch (err) {
                this.appendError("eval-error", `Failed to resolve selector for "${selectorStatement(query)}": ${err instanceof Error ? err.message : JSON.stringify(err)}`, 0);
                return undefined;
            }
        }

        if (ops.length > 0 && nodes.length > 0) {
            try {
                return this.resolveQueryOps({ ops, nodes, type, repeated, all, limit, format, pattern, distinct, negate, removeNulls, value });
            }
            catch (err) {
                this.appendError("eval-error", `Failed to resolve operation for "${selectorStatement(query)}": ${err instanceof Error ? err.message : JSON.stringify(err)}`, 0);
                return undefined;
            }
        }
        else if (type === "boolean") {
            // if type is boolean then result is based on whether the query resulted in any hits
            let value = !repeated ? nodes.length > 0 : [nodes.length > 0];
            if (negate)
                value = !value;
            return {
                nodes,
                key: this.contextKey(),
                value
            }
        }
        else if (nodes.length > 0) {
            return this.formatResult({ nodes, key: this.contextKey(), value }, type, all, limit, format, pattern, distinct, negate, removeNulls);
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

    private resolveQueryOps({ ops, nodes, type, repeated, all, limit, format, pattern, distinct, negate, removeNulls, value }: ResolveQueryOpsParams): QueryResult {
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
                if (!this.validateOperands(operator, operands, ["string", "number"], ["number"]))
                    break;
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
                if (!this.validateOperands(operator, operands, ["string"]))
                    break;
                const regexp = createRegExp(operands[0]);
                if (!regexp) {
                    this.appendError("invalid-operand", `Invalid regular expression for "extract"`, 0);
                }
                else if (result.value instanceof Array && result.value.every(value => typeof value === "string")) {
                    result.value = result.value.map(value => regexpExtract(value.trim(), regexp));
                    filterQueryResult($, result, value => value !== null);
                }
                else if (typeof result.value === "string") {
                    result.value = regexpExtract(result.value.trim(), regexp);
                }
                else {
                    result.value = null;
                }
            }
            else if (operator === "extractAll") {
                if (!this.validateOperands(operator, operands, ["string"], ["string"]))
                    break;
                const regexp = createRegExp(operands[0]);
                const delim = operands[1] as string ?? "\n";
                if (!regexp) {
                    this.appendError("invalid-operand", `Invalid regular expression for "extractAll"`, 0);
                }
                else if (result.value instanceof Array && result.value.every(value => typeof value === "string")) {
                    result.value = result.value.map(value => regexpExtractAll(value.trim(), regexp)?.join(delim) || null);
                    filterQueryResult($, result, value => value !== null);
                }
                else if (typeof result.value === "string") {
                    result.value = regexpExtractAll(result.value.trim(), regexp);
                    if (!trim)
                        result.formatted = true;
                }
                else {
                    result.value = null;
                }
            }
            else if (operator === "filter" && (isFormula(operands[0]) || isRegexp(operands[0]))) {
                if (!this.validateOperands(operator, operands, ["string"]))
                    break;
                if (result.value instanceof Array) {
                    /*
                    const count = result.nodes.length;
                    filterQueryResult($, result, (value, index) => {
                        const hit = this.evaluateBoolean(operands[0], { value, index, count });
                        return hit || false;
                    });
                    */
                    /**/
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
                    /**/
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
            else if (operator === "json") {
                if (!this.validateOperands(operator, operands, [], ["string"]))
                    break;
                const formula = operands[0];
                if (formula && !isFormula(formula)) {
                    this.appendError("invalid-operand", `Invalid formula for "json"`, 0);
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
                    const json = tryParseJson(input.values[i]);
                    if (json !== undefined) {
                        const value = formula ? this.evaluate(formula, { value: json, index: i, count: n }) : json;
                        if (value !== null && value !== undefined) {
                            output.elements.push(input.elements[i]);
                            output.values.push(value);
                        }
                    }
                }
                if (output.elements.length === 0) {
                    result.nodes = $([]);
                    result.value = null;
                }
                else if (repeated || all) {
                    result.nodes = $(output.elements);
                    result.value = output.values;
                }
                else {
                    result.nodes = $(output.elements[0]);
                    result.value = output.values[0];
                }
                result.raw = true;
            }
            else if (operator === "map") {
                if (!this.validateOperands(operator, operands, ["string"]))
                    break;
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
                if (!this.validateOperands(operator, operands, ["string", "string"]))
                    break;
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
                if (!this.validateOperands(operator, operands, ["string"]))
                    break;
                this.eachNode(result, (node, value) => {
                    const content = String(this.evaluate(operands[0], { value }));
                    node.html(content);
                });
                result.value = null;
            }
            else if (operator === "replaceTag") {
                if (!this.validateOperands(operator, operands, ["string"], ["boolean"]))
                    break;
                const newTag = String(this.evaluate(operands[0], { value: operands[0] }));
                const keepProps = operands[1] as boolean ?? true;
                this.eachNode(result, node => {
                    // adapted from https://stackoverflow.com/questions/918792/use-jquery-to-change-an-html-tag
                    const newNode = $(newTag);
                    if (keepProps) {
                        mergeElements(newNode, node);
                    }
                    node.wrapAll(newNode);
                    node.contents().unwrap();
                });
                result.value = null;
            }
            else if (operator === "replaceText") {
                if (!this.validateOperands(operator, operands, ["string"]))
                    break;
                this.eachNode(result, (node, value) => {
                    const content = String(this.evaluate(operands[0], { value }));
                    node.text(content);
                });
                result.value = null;
            }
            else if (operator === "replaceWith") {
                if (!this.validateOperands(operator, operands, ["string"]))
                    break;
                this.eachNode(result, (node, value) => {
                    const content = String(this.evaluate(operands[0], { value }));
                    node.replaceWith(content);
                });
                result.value = null;
            }
            else if (operator === "reverse") {
                if (!this.validateOperands(operator, operands, [], []))
                    break;
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
                if (!this.validateOperands(operator, operands, [], ["string","number"]))
                    break;
                const text = result.value instanceof Array ? result.value.join("\n") : result.value as string;
                const separator = operands[0] as string || "\n";
                const limit = typeof operands[1] === "number" && operands[1] >= 0 ? operands[1] : undefined;
                result.value = text.split(separator, limit);
            }
            else if (operator === "shadow") {
                result.nodes = $(result.nodes.toArray().map(element => element.shadowRoot).filter(obj => !!obj));
            }
            else if (operator === "slot") {
                if (!this.validateOperands(operator, operands, [], ["boolean"]))
                    break;
                const flatten = parseBoolean(operands[0]);
                result.nodes = $(result.nodes.toArray().map(element => element.assignedElements({ flatten })).filter(obj => !!obj));
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
        return this.formatResult(result, type, all, limit, format, pattern, distinct, negate, removeNulls);
    }

    async run(actions: Action[], label = "", wraparound = false): Promise<DispatchResult | undefined> {
        this.step.unshift(0);
        this.lastStep.unshift(actions.length);

        if (label)
            label += " ";

        this.state.vars.__step.unshift(0); // push step state
        const j = this.skipSteps(actions, label, wraparound);
        for (let i = j; i < actions.length; i++) {
            const action = actions[i];
            const status = this.runExtractStatus(action);

            this.step[0] = i + 1;
            const step = this.step.reverse().join(".");
            this.log(`${label}STEP ${step}/${actions.length} {${status.action}}`);
            if (this.online && this.state.debug)
                window.postMessage({
                    direction: "syphonx",
                    message: {
                        ...status,
                        key: "extract-status",
                        step,
                        of: this.lastStep.reverse().join(".")
                    }
                });

            this.state.vars.__step[0] = i + 1;
            const code = await this.dispatch(action);
            if (code) {
                this.log(`${label}BREAK at STEP ${step} [${code}]`);
                this.state.vars.__step.shift(); // pop step state
                this.step.shift();
                this.lastStep.shift();
                return code;
            }
        }
        this.state.vars.__step.shift(); // pop step state
        this.log(`${label}${actions.length} steps completed`);

        this.step.shift();
        this.lastStep.shift();
    }

    private runExtractStatus(action: Action): ExtractStatus {
        const [key] = Object.keys(action);
        const unit = (action as Record<string, { name: string }>)[key];
        const status: ExtractStatus = {
            step: "",
            of: "",
            action: key,
            name: unit.name
        };

        if (action.hasOwnProperty("snooze")) {
            const obj = (action as SnoozeAction).snooze;
            status.timeout = obj instanceof Array ? obj[1] || obj[0] : typeof obj === "number" ? obj : obj.interval[1] || obj.interval[0];
        }
        else if (action.hasOwnProperty("waitfor")) {
            const obj = (action as WaitForAction).waitfor;
            status.timeout = obj.timeout || defaultTimeoutSeconds;
        }
        else if (action.hasOwnProperty("click")) {
            const obj = (action as ClickAction).click;
            status.timeout = 0;
            if (obj.snooze)
                status.timeout += obj.snooze[1] || obj.snooze[0];
            if (obj.waitfor?.timeout)
                status.timeout += obj.waitfor.timeout;
        }
        return status;
    }

    private screenshot({ name, selector, params, when }: Screenshot): void {
        this.yield({
            name: `SCREENSHOT ${name ? ` ${name}` : ""}`,
            params: {
                screenshot: {
                    ...params,
                    name,
                    selector: this.evaluateString(selector)
                },
                action: "screenshot", // legacy shim
                selector // legacy shim
            },
            when
        });
    }

    private async scroll({ name, query, target, behavior = "smooth", block, inline, when }: Scroll): Promise<void> {
        if (this.online) {
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
                this.state.vars.__metrics.steps += 1;
            }
            else {
                this.state.vars.__metrics.skipped += 1;
                this.log(`SCROLL${name ? ` ${name}` : ""} SKIPPED ${when}`);
            }
        }
        else {
            this.log(`SCROLL${name ? ` ${name}` : ""} IGNORED`);
        }
    }

    public select(selects: Select[], pivot = false): unknown {
        const data = {} as Record<string, DataItem | null>;
        for (const select of selects) {
            //this.validateSelect(select);
            let item: DataItem | null = null;
            if (this.when(select.when)) {
                if (select.pivot) {
                    item = this.selectResolvePivot(select, item);
                }
                else {
                    if (!pivot)
                        this.pushContext({ name: select.name }, select.context);

                    if (select.union) {
                        item = this.selectResolveUnion(select, item, data);
                    }
                    else {
                        if (select.query)
                            item = this.selectResolveSelector(select, item);                        
                        if (select.value !== undefined)
                            item = this.selectResolveValue(select, { data, value: item?.value });
                    }

                    if (!pivot) {
                        if (isEmpty(item?.value) && select.required)
                            this.appendError("select-required", `Required select '${this.contextKey()}' not found`, 0);
                        this.popContext();
                    }
                }
            }

            if (select.name?.startsWith("_") && item)
                this.state.vars[select.name] = item.value;
            else if (select.name)
                data[select.name] = item;
            else
                return item;
        }
        this.state.vars.__metrics.steps += 1;
        return data;
    }

    private async selectWaitfor(selects: Select[]): Promise<DispatchResult> {
        selects = selects.filter(select => select.waitfor && select.query);
        for (const select of selects) {
            const on = select.all ? "all" : "any";
            this.pushContext({ name: select.name }, select.context);
            const code = await this.waitforQuery(select.query!, on, this.state.vars.__timeout, true, undefined, "SELECT");
            this.popContext();
            if (code === "timeout" && select.required)
                return "timeout";
        }
        return null;
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
            if (select.select) {
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
            else {
                subitem = {
                    nodes: this.nodeKeys(result.nodes),
                    key: result.key,
                    value: result.value
                };
            }
        }
        this.log(`SELECT ${this.contextKey()} -> ${selectorStatements(select.query)} -> ${subitem ? trunc(subitem.value) : "(none)"}${item ? ` merge(${typeName(item?.value)}, ${typeName(subitem?.value)})` : ""}`);
        return merge(item, subitem);
    }

    private selectResolveUnion(select: Select, item: DataItem | null, data: unknown): DataItem | null {
        const { union, ...superselect } = select;
        if (union) {
            for (const subselect of union) {
                if (this.when(subselect.when)) {
                    this.pokeContext({
                        action: "union",
                        union: union.indexOf(subselect)
                    });
                    this.log(`UNION ${this.contextKey()} ${union.indexOf(subselect) + 1}/${union.length}`);
                    if (subselect.pivot) {
                        item = this.selectResolvePivot({ ...superselect, ...subselect }, item);
                    }
                    else {
                        if (subselect.query) {
                            item = this.selectResolveSelector({ ...superselect, ...subselect }, item);
                        }
                        if (subselect.value) {
                            item = this.selectResolveValue(subselect, { value: item?.value });
                        }
                    }
                }
                else {
                    this.log(`UNION SKIPPED ${this.contextKey()} ${union.indexOf(subselect) + 1}/${union.length}`);
                }
            }
        }
        return item;
    }

    private selectResolveValue(select: Select, context?: Partial<{ data: Record<string, DataItem | null>, value: unknown }>): DataItem {
        const result = this.evaluate(select.value, context);
        const value = coerceSelectValue(result, select.type, select.repeated);
        return {
            nodes: [],
            key: this.contextKey(),
            value
        };
    }

    private skipSteps(actions: Action[], label: string, wraparound: boolean): number {
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

    private async snooze(obj: Snooze | number | [number] | [number, number]): Promise<void> {
        const { name, interval, when } = obj instanceof Array ? { name: "", interval: obj, when: undefined } : typeof obj === "number" ? { name: "", interval: [obj], when: undefined } : obj;
        if (this.online) {
            if (this.when(when, `SNOOZE${name ? ` ${name}` : ""}`)) {
                const duration = this.maxTimeout(interval[0]);
                this.log(`SNOOZE${name ? ` ${name}` : ""} ${duration.toFixed(1)}s`);
                const timer = new Timer();
                await sleep(duration * 1000);
                this.state.vars.__metrics.snooze += timer.elapsed();
                this.state.vars.__metrics.steps += 1;
            }
            else {
                this.state.vars.__metrics.skipped += 1;
                this.log(`SNOOZE${name ? ` ${name}` : ""} ${interval[0]}s SKIPPED ${when}`);
            }
        }
        else {
            this.log(`SNOOZE${name ? ` ${name}` : ""} ${interval[0]}s IGNORED`);
        }
    }

    private async switch(switches: Switch[]): Promise<void> {
        this.state.vars.__metrics.steps += 1;
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

    public text(nodes: JQuery<HTMLElement>, format?: SelectFormat): string[] {
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
                const tag = node.prop("tagName")?.toLowerCase();
                const whitespace = tag === "br" || tag === "p" ? "\n" : " ";
                node.append(whitespace);
                if (index === 0) {
                    node.prepend(" ");
                }
            });
            return nodes.toArray().map(element => $(element).text().trim().replace(/[ ]{2,}/g, " "));
        }
    }

    public transform(transforms: Transform[]): void {
        for (const transform of transforms) {
            if (this.when(transform.when, `TRANSFORM${transform.name ? ` ${transform.name}` : ""}`)) {
                const query = transform.query;
                try {
                    const result = this.resolveQuery({ query, repeated: true, all: true, limit: null });
                    this.log(`TRANSFORM${transform.name ? ` ${transform.name}` : ""} ${selectorStatement(query)} -> (${result?.nodes?.length || 0} nodes)`);
                }
                catch (err) {
                    this.log(`TRANSFORM${transform.name ? ` ${transform.name}` : ""} ERROR ${selectorStatement(query)}: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
                }
            }
            else {
                this.log(`TRANSFORM${transform.name ? ` ${transform.name}` : ""} SKIPPED ${selectorStatement(transform.query)}`);
            }
        }
        this.state.vars.__metrics.steps += 1;
    }

    private validateOperands(operator: SelectQueryOperator, operands: SelectQueryOperand[], required: Array<"string" | "number" | "boolean">, optional: Array<"string" | "number" | "boolean"> = []): boolean {
        for (let i = 0; i < required.length; ++i) {
            if (typeof operands[i] !== required[i]) {
                if (isCoercibleTo(operands[i], required[i])) {
                    operands[i] = coerce(operands[i], required[i])
                }
                else {
                    this.appendError("invalid-operand", `Parameter #${i + 1} of "${operator}" is invalid: "${operands[i]}" is not a ${required[i]}`, 0);
                    return false;
                }
            }
        }
        for (let i = 0; i < optional.length; ++i) {
            const j = i + required.length;
            if (operands[j] !== undefined && operands[j] !== null && typeof operands[j] !== optional[i]) {
                if (isCoercibleTo(operands[j], optional[i])) {
                    operands[j] = coerce(operands[j], optional[i])
                }
                else {
                    this.appendError("invalid-operand", `Parameter #${j + 1} of "${operator}" is invalid: "${operands[j]}" is not a ${optional[i]}`, 0);
                    return false;
                }
            }
        }
        if (operands.length > required.length + optional.length) {
            this.appendError("invalid-operand", `Too many parameters specified for "${operator}"`, 0)
            return false;
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

    /*
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
    */

    private async waitfor({ name, query, select, timeout, on = "any", required, pattern, when }: WaitFor, label = ""): Promise<DispatchResult> {
        if (label)
            label += " ";
        if (this.online) {
            if (this.when(when, `WAITFOR${name ? ` ${name}` : ""}`)) {
                this.log(`TIMEOUT BEFORE: ${timeout}`);
                timeout = this.maxTimeout(timeout);
                this.log(`TIMEOUT AFTER: ${timeout}`);
                let code: DispatchResult = null;
                const timer = new Timer();
                if (query) {
                    this.log(`${label}WAITFOR${name ? ` ${name}` : ""} QUERY ${trunc(query)} on=${on}, timeout=${timeout.toFixed(1)}s, pattern=${pattern}`);
                    code = await this.waitforQuery(query, on, timeout, required, pattern, label);
                }
                else if (select) {
                    this.log(`${label}WAITFOR${name ? ` ${name}` : ""} SELECT ${trunc(select)} on=${on}, timeout=${timeout.toFixed(1)}s, pattern=${pattern}`);
                    code = await this.waitforSelect(select, on, timeout, required, pattern, label);
                }
                this.state.vars.__metrics.waitfor += timer.elapsed();
                this.state.vars.__metrics.steps += 1;
                return code;
            }
            else {
                this.state.vars.__metrics.skipped += 1;
                this.log(`${label}WAITFOR${name ? ` ${name}` : ""} SKIPPED ${selectorStatements(query)}`);
                return null;
            }
        }
        else {
            this.log(`${label}WAITFOR${name ? ` ${name}` : ""} IGNORED ${selectorStatements(query)}`);
            return null;
        }
    }

    private async waitforQuery(query: SelectQuery[], on: SelectOn, timeout: number, required: boolean | undefined, pattern: string | undefined, label = ""): Promise<DispatchResult> {
        if (label)
            label += " ";
        const t0 = Date.now();
        let elapsed = 0;
        let pass = false;
        let result = undefined;
        timeout = this.maxTimeout(timeout);
        while (!pass && elapsed < timeout) {
            [pass, result] = this.queryCheck(query, on, pattern);
            if (!pass)
                await sleep(100);
            elapsed = (Date.now() - t0) / 1000;
        }

        const message = `${label}WAITFOR QUERY ${selectorStatements(query)}, timeout=${timeout.toFixed(1)}s -> ${trunc(result?.value)}${pattern ? ` (valid=${result?.valid})` : ""} -> on=${on} -> ${pass} (${elapsed.toFixed(1)}s${elapsed > timeout ? " TIMEOUT": ""})`;
        this.log(message);
        if (pass) {
            return null;
        }
        else if (required) {
            this.appendError("waitfor-timeout", message, 1);
            this.state.vars.__metrics.timeouts += 1;
            return "timeout";
        }
        else {
            return null;
        }
    }

    private async waitforSelect(selects: Select[], on: SelectOn, timeout: number, required: boolean | undefined, pattern: string | undefined, label = ""): Promise<DispatchResult> {
        if (label)
            label += " ";
        for (const select of selects) {
            if (!select.name || !select.name.startsWith("_") || !(!select.type || select.type === "boolean") || select.repeated) {
                this.appendError("invalid-select", "waitfor select must all be internal, boolean, and not repeated", 0);
                return "invalid";
            }
        }
        const t0 = Date.now();
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
            elapsed = (Date.now() - t0) / 1000;
        }

        const message = `${label}WAITFOR SELECT ${JSON.stringify(state)}${pattern ? "valid=???" : ""} -> on=${on} -> ${pass} (${elapsed.toFixed(1)}s${elapsed > timeout ? " TIMEOUT": ""})`;
        this.log(message);
        if (pass) {
            return null;
        }
        else if (required) {
            this.appendError("waitfor-timeout", message, 1);
            this.state.vars.__metrics.timeouts += 1;
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

    private yield({ name = "", params, when }: Yield): void {
        if (name)
            name = " " + name;
        if (this.online) {
            if (this.when(when, `YIELD${name}`)) {
                this.state.vars.__step[0] += 1; // advance to next step on re-entry
                const step = this.state.vars.__step;
                this.log(`YIELD${name} step=${JSON.stringify(step)} params=${JSON.stringify(params || {})}`);
                params = { ...params };
                for (const key of Object.keys(params))
                    params[key] = this.evaluate(params[key]);
                this.state.yield = { step, params };
                this.state.vars.__metrics.steps += 1;
                this.state.vars.__metrics.yields += 1;
                throw "YIELD";
            }
            else {
                this.state.vars.__metrics.skipped += 1;
                this.log(`YIELD${name} SKIPPED ${when}`);
            }
        }
        else {
            this.log(`YIELD${name} IGNORED ${when}`);
        }
        return undefined;
    }
}
