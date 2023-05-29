export interface Break {
    name?: string;
    query?: SelectQuery[]; // boolean
    on?: SelectOn; // only used with query
    pattern?: string; // only used with query, waits for a specific text pattern if specified
    when?: When; // if when is specified then when is evaluated first, and then query is evaluated next if specified, if when not specified then query is evaluated by itself
}

export interface Click {
    name?: string;
    query: SelectQuery[];
    waitfor?: WaitFor; // skip if no nodes selected
    snooze?: SnoozeInterval;
    required?: boolean;
    retry?: number; // not implemented
    yield?: boolean;
    waitUntil?: DocumentLoadState;
    when?: When;
}

export interface Each {
    name?: string;
    query: SelectQuery[]; // boolean, an error is produced if no element is found.
    actions: Action[];
    context?: number | null; // sets context of selector query, or specify null for global context (default=1)
    when?: When;
}

export interface Error {
    name?: string;
    code?: ExtractErrorCode; // required, default is "app-error"
    message: string; // optional default based on code
    level?: number; // indicates error level, 0 is non-retryable, 1 or above is retryable (default=1)
    stop?: boolean; // stops processing, default is false if level is 0 or not specified, otherwise true
    query?: SelectQuery[]; // boolean
    negate?: boolean; // Negates the query, producing an error if an element is found.
    when?: When;
}

export interface GoBack {
    name?: string;
    when?: When;
}

export type LocatorMethod = string; // https://playwright.dev/docs/api/class-locator

export interface Locator {
    name: string; // name of the intermediate property for the host to feed forward into next syphonx extract iteration via state.vars
    frame?: string; // the selector to pass to page.frameLocator()
    selector: string; // the selector to pass to page.locator()
    method?: LocatorMethod; // name of a playwright locator method such as "getAttribute", "allTextContents", etc. (see https://playwright.dev/docs/api/class-locator)
    params?: unknown[]; // method parameters for the locator method
    promote?: boolean; // directs the host to promote the shadow root from the element out into the top level DOM
    chain?: boolean; // chains a locator to the previous locator, default is false
    when?: string;
}

export interface Navigate {
    name?: string;
    url: string;
    waitUntil?: DocumentLoadState;
    when?: string;
}

export interface Reload {
    name?: string;
    waitUntil?: DocumentLoadState;
    when?: When;
}

export interface Repeat {
    name?: string;
    actions: Action[];
    limit?: number | string; // max # of repitions (default=100) or a forumla to calculate the limit
    errors?: number; // error limit (default=1)
    when?: When;
}

export interface Screenshot {
    name?: string;
    selector?: string;
    when?: When;
}

export interface Scroll {
    name?: string;
    query?: SelectQuery[];
    target?: ScrollTarget; // Determines the target of the scroll as top, bottom, or query
    behavior?: ScrollBehavior; // Determines whether to scroll smoothly or immediately jump to target (default=smooth)
    block?: ScrollLogicalPosition; // Determines vertical alignment (default=start)
    inline?: ScrollLogicalPosition; // Determines horizontal alignment (default=nearest)
    when?: When;
}

export interface SelectTarget {
    query?: SelectQuery[];
    pivot?: SelectTarget;
    select?: Select[];
    value?: unknown; // if both query and value are used, value executes after query
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
    distinct?: boolean; // removes duplicate values from arrays
    negate?: boolean; // negates a boolean result
    removeNulls?: boolean; // removes null values from arrays
    when?: When; // SKIPPED actions indicate an unmet when condition, BYPASSED actions indicate unexecuted actions in offline mode
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
}

export interface Yield {
    name?: string;
    params?: YieldParams;
    when?: When;
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
export type GoBackAction = { goback: GoBack };
export type LocatorAction = { locator: Locator[] };
export type NavigateAction = { navigate: Navigate };
export type ReloadAction =  { reload: Reload };
export type RepeatAction = { repeat: Repeat };
export type ScreenshotAction = { screenshot: Screenshot };
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
    | GoBackAction
    | LocatorAction
    | NavigateAction
    | ReloadAction
    | RepeatAction
    | ScreenshotAction
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
    distinct?: boolean;
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
    version: string;
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
      "app-error"
    | "click-timeout"
    | "click-required"
    | "error-limit"
    | "eval-error"
    | "external-error"
    | "fatal-error"
    | "invalid-select"
    | "invalid-operator"
    | "invalid-operand"
    | "select-required"
    | "waitfor-timeout";

export interface YieldParams extends Record<string, unknown> {
    timeout?: number;
    waitUntil?: DocumentLoadState;
    click?: {};
    goback?: {};
    locator?: YieldLocator;
    navigate?: YieldNavigate;
    reload?: {};
    screenshot?: YieldScreenshot;
}

export interface YieldLocator {
    frame?: string;
    selector: string;
    method: LocatorMethod;
    params: unknown[];
}

export interface YieldNavigate {
    url: string;
}

export interface YieldScreenshot {
    selector?: string;
}

export interface YieldState {
    step: number[];
    params?: YieldParams;
    level?: number;
    result?: unknown;
}
