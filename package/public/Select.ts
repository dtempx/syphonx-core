import { When } from "./When.js";

/**
 * Base interface for selection targets, defining how data is queried and
 * extracted from DOM elements. Used as the building block for {@link Select}
 * and as the element type for {@link Select.union}.
 */
export interface SelectTarget {
    /**
     * One or more selector queries to locate DOM elements.
     * Each entry is a "stage" — by default only the first stage that matches
     * is used; set `all` to `true` to include results from every stage.
     *
     * Query format: `[["css-selector", ["method", "arg1"], ["method2"]]]`
     * where methods chain jQuery operations (e.g. `["attr", "href"]`, `["split", ","]`).
     * XPath selectors use a `/` or `xpath:` prefix.
     *
     * @example
     * // Simple CSS selector
     * { name: "title", query: [["h1"]] }
     * // => { title: "Example Domain" }
     *
     * @example
     * // Chained operations: extract an attribute then resolve as an absolute URL
     * { name: "link", query: [["a", ["attr", "href"]]], format: "href" }
     * // => { link: "https://www.example.com/foo" }
     *
     * @example
     * // Multiple fallback stages — first match wins (all: false by default)
     * { name: "heading", query: [["h1"], ["h2"], ["h3"]] }
     *
     * @example
     * // XPath selector
     * { name: "price", query: [["//span[@class='price']"]] }
     */
    query?: SelectQuery[];

    /**
     * @deprecated Use jQuery traversal selectors instead.
     * Runs a sub-selection against each node matched by `query`, pivoting
     * the context so each node is processed individually.
     */
    pivot?: SelectTarget;

    /**
     * Nested selections to execute within the context of nodes matched by
     * `query`. Produces structured objects when combined with `type: "object"`.
     *
     * @example
     * // Extract a structured object from a DOM subtree
     * {
     *   name: "product",
     *   type: "object",
     *   query: [["div.product"]],
     *   select: [
     *     { name: "name",  query: [[".name"]] },
     *     { name: "price", query: [[".price"]], type: "number" }
     *   ]
     * }
     * // => { product: { name: "Widget", price: 9.99 } }
     */
    select?: Select[];

    /**
     * A literal value or expression to use as the selection result.
     * If both `query` and `value` are specified, `query` executes first
     * and its result is available to the `value` expression as `value`.
     *
     * Expressions are wrapped in `{}` and have access to: `data` (accumulated
     * output), `value` (result of the preceding `query`), `url`, and any
     * template variables prefixed with `_`.
     *
     * @example
     * // Literal string value
     * { name: "source", value: "manual" }
     * // => { source: "manual" }
     *
     * @example
     * // Expression combining previously extracted fields
     * { name: "full", value: "{`${data.first} ${data.last}`}" }
     *
     * @example
     * // Post-process a query result (query runs first, then value)
     * { name: "upper", query: [["h1"]], value: "{value.toUpperCase()}" }
     * // => { upper: "EXAMPLE DOMAIN" }
     *
     * @example
     * // Inject the page URL
     * { name: "pageUrl", value: "{url}" }
     */
    value?: unknown;

    /**
     * When `true`, includes results from all query stages instead of stopping
     * at the first stage that matches. Default is `false`.
     *
     * Also affects boolean aggregation: when `true`, all values are AND'ed
     * together; when `false`, values are OR'ed.
     *
     * @example
     * // all: false (default) — stops at the first stage that matches
     * { name: "p1", all: false, query: [["h1"], ["h2"]] }
     * // Given <h1>abc</h1><h1>def</h1><h2>ghi</h2>
     * // => { p1: "abc\ndef" }  (only h1 results)
     *
     * @example
     * // all: true — collects results from every matching stage
     * { name: "p2", all: true, query: [["h1"], ["h2"]] }
     * // Given <h1>abc</h1><h1>def</h1><h2>ghi</h2><h2>jkl</h2>
     * // => { p2: "abc\ndef\nghi\njkl" }
     */
    all?: boolean;

    /**
     * @deprecated Use `all` instead.
     * Limits the number of query stages that produce hits before stopping.
     * Default is the total number of stages. Specify `null` for unlimited.
     */
    hits?: number | null;

    /**
     * Limits the number of nodes returned by the query.
     * Default is `1` when `repeated` is `false` and `all` is `false`,
     * otherwise unlimited. Specify `null` to explicitly force unlimited nodes.
     */
    limit?: number | null;

    /**
     * Controls how string values are formatted.
     * Default is `"multiline"` when `type` is `"string"`.
     * The `"href"` format resolves relative URLs against the page origin.
     *
     * @example
     * // "singleline" collapses whitespace into single spaces
     * { name: "text", query: [["p"]], format: "singleline" }
     * // Given <p>\n  AAA\n  BBB\n</p>  =>  { text: "AAA BBB" }
     *
     * @example
     * // "multiline" (default) preserves line breaks
     * { name: "text", query: [["p"]], format: "multiline" }
     * // Given <p>\n  AAA\n  BBB\n</p>  =>  { text: "AAA\nBBB" }
     *
     * @example
     * // "href" resolves relative URLs against the page origin
     * { name: "url", query: [["a", ["attr", "href"]]], format: "href" }
     * // Given <a href="/path"> on https://example.com  =>  { url: "https://example.com/path" }
     */
    format?: SelectFormat;

    /**
     * A regular expression pattern used to validate string results.
     * When set, `result.valid` is `true` only if every extracted string
     * matches the pattern. Only applies when `type` is `"string"`.
     */
    pattern?: string;

    /**
     * When `true`, processes the selector as a single unit rather than
     * iterating over each matched node individually. Forces `all` to `true`
     * for any nested sub-selects so all node values are included.
     */
    collate?: boolean;

    /** An optional comment for documentation purposes. Not used at runtime. */
    comment?: string;

    /**
     * Sets the DOM context depth for the selector query.
     * Default is `1` (inherits from the immediate parent context).
     * Specify `null` for global context (the entire document).
     */
    context?: number | null;

    /**
     * When `true`, removes duplicate values from array results.
     * Uses reference equality (`indexOf`) for deduplication.
     *
     * @example
     * // Without distinct: duplicates are preserved
     * { name: "tags", repeated: true, query: [["li"]] }
     * // Given <li>alpha</li><li>beta</li><li>alpha</li>
     * // => { tags: ["alpha", "beta", "alpha"] }
     *
     * @example
     * // With distinct: duplicates are removed
     * { name: "tags", repeated: true, distinct: true, query: [["li"]] }
     * // Given <li>alpha</li><li>beta</li><li>alpha</li>
     * // => { tags: ["alpha", "beta"] }
     */
    distinct?: boolean;

    /**
     * When `true`, negates a boolean result. For arrays of booleans,
     * each individual value is negated.
     */
    negate?: boolean;

    /**
     * When `true`, filters out `null` values from array results.
     */
    removeNulls?: boolean;

    /**
     * When `true`, waits for elements matching `query` to appear in the DOM
     * before proceeding. Only effective in online (browser) mode.
     * If the wait times out and `required` is `true`, returns a timeout error.
     */
    waitfor?: boolean;

    /**
     * A condition that must be met for the selection to execute.
     * Actions with an unmet condition are logged as SKIPPED.
     * Actions that cannot execute in offline mode are logged as BYPASSED.
     */
    when?: When;
}

/**
 * Defines a named data extraction from the DOM. Extends {@link SelectTarget}
 * with output-shaping fields (`name`, `repeated`, `type`) and the ability
 * to merge multiple extraction strategies via `union`.
 *
 * @example
 * // Basic named string extraction
 * { name: "title", query: [["h1"]] }
 * // => { title: "Example Domain" }
 *
 * @example
 * // Unnamed (projected) extraction — result returned directly, not keyed
 * { query: [["h1"]] }
 * // => "Example Domain"
 *
 * @example
 * // Boolean type check
 * { name: "isDiv", type: "boolean", query: [["div", ["is", "div"]]] }
 * // => { isDiv: true }
 *
 * @example
 * // Repeated (array) extraction
 * { name: "items", repeated: true, query: [["li"]] }
 * // Given <li>one</li><li>two</li><li>three</li>
 * // => { items: ["one", "two", "three"] }
 *
 * @example
 * // Nested object extraction
 * {
 *   name: "product",
 *   type: "object",
 *   query: [["div"]],
 *   select: [
 *     { name: "name", query: [[".name"]] },
 *     { name: "type", query: [[".type"]] }
 *   ]
 * }
 * // => { product: { name: "apple", type: "fruit" } }
 *
 * @example
 * // Template variable (name starts with "_") — stored in vars, not output data
 * { name: "_category", query: [["meta[name='category']", ["attr", "content"]]] }
 * // Stored in state.vars._category, accessible in later expressions via {_category}
 *
 * @example
 * // Union — merge results from multiple DOM regions into one field
 * {
 *   name: "all_items",
 *   repeated: true,
 *   union: [
 *     { query: [["div > p"]] },
 *     { query: [["ul > li"]] }
 *   ]
 * }
 * // => { all_items: ["para1", "para2", "item1", "item2"] }
 */
export interface Select extends SelectTarget {
    /**
     * The property name in the output data object. If omitted, the value is
     * projected (returned directly instead of assigned to a key).
     * Names starting with `_` are stored as template variables instead of output data.
     *
     * @example
     * // Named: result is placed at data.title
     * { name: "title", query: [["h1"]] }
     *
     * @example
     * // Unnamed (projected): result becomes the top-level data value
     * { query: [["h1"]] }
     *
     * @example
     * // Template variable: stored in vars._sku for use in later expressions
     * { name: "_sku", query: [["span.sku"]] }
     */
    name?: string;

    /**
     * When `true`, the result is always returned as an array.
     * When `false` (default), strings are newline-concatenated (or space-concatenated
     * for `"singleline"` format), booleans are OR'ed together, and other types
     * return only the first value.
     *
     * @example
     * // repeated: true — every matched node becomes an array element
     * { name: "titles", repeated: true, query: [["h1"]] }
     * // Given <h1>First</h1><h1>Second</h1>
     * // => { titles: ["First", "Second"] }
     *
     * @example
     * // repeated: false (default) — multiple nodes are joined
     * { name: "title", repeated: false, query: [["h1"]] }
     * // Given <h1>First</h1><h1>Second</h1>
     * // => { title: "First\nSecond" }
     */
    repeated?: boolean;

    /**
     * When `true`, appends a `select-required` error if no value is found
     * for this selector. Default is `false`.
     *
     * @example
     * // Missing required field — adds a "select-required" error and sets ok: false
     * { name: "price", required: true, query: [["span.price"]] }
     * // If no <span class="price"> exists:
     * // errors: [{ code: "select-required", key: "price", message: "Required select 'price' not found" }]
     *
     * @example
     * // Optional field — missing value silently produces null, no error
     * { name: "subtitle", required: false, query: [["h2"]] }
     * // If no <h2> exists:  => { subtitle: null }
     */
    required?: boolean;

    /**
     * The expected data type of the extracted value.
     * Default is `"string"`, except when `select` (sub-selections) is present,
     * in which case the default is `"object"`.
     *
     * Values are coerced to the target type: strings are formatted according to
     * `format`, numbers are parsed via `parseFloat`, and booleans treat non-empty
     * truthy values as `true`.
     *
     * @example
     * // type: "string" (default)
     * { name: "label", type: "string", query: [["h1"]] }
     * // => { label: "Hello" }
     *
     * @example
     * // type: "number" — parsed with parseFloat
     * { name: "count", type: "number", query: [["span.count"]] }
     * // Given <span class="count">42</span>  =>  { count: 42 }
     *
     * @example
     * // type: "boolean" — truthy/falsy coercion
     * { name: "active", type: "boolean", query: [["div", ["is", "div"]]] }
     * // => { active: true }
     *
     * @example
     * // type: "object" — used with nested select to produce a structured object
     * { name: "item", type: "object", query: [["div"]], select: [{ name: "x", query: [["span"]] }] }
     * // => { item: { x: "value" } }
     */
    type?: SelectType;

    /**
     * An array of alternative selection targets that are evaluated in sequence
     * and whose results are merged. Useful for combining data from different
     * parts of the DOM into a single output field.
     *
     * Each entry in the union inherits properties from the parent `Select`
     * and can override them individually.
     *
     * @example
     * // Merge paragraphs and list items into a single repeated field
     * {
     *   name: "content",
     *   type: "string",
     *   repeated: true,
     *   union: [
     *     { query: [["div > p"]] },
     *     { query: [["ul > li"]] }
     *   ]
     * }
     * // => { content: ["para1", "para2", "item1", "item2"] }
     */
    union?: SelectTarget[];
}

/**
 * The data type that a selected value is coerced to.
 * - `"string"` — formatted according to the `format` option
 * - `"number"` — parsed with `parseFloat`
 * - `"boolean"` — truthy/falsy coercion
 * - `"object"` — used with sub-selects to produce structured data
 */
export type SelectType = "string" | "number" | "boolean" | "object";

/** A selector query: a CSS/XPath selector string followed by zero or more chained operations. */
export type SelectQuery = [string, ...SelectQueryOp[]];

/** A chained query operation: an operator name followed by its arguments (e.g. `["attr", "href"]`). */
export type SelectQueryOp = [string, ...unknown[]];

/** The operator name in a query operation (e.g. `"attr"`, `"split"`, `"trim"`). */
export type SelectQueryOperator = string;

/** An operand value passed to a query operator. */
export type SelectQueryOperand = unknown;

/**
 * Controls how extracted string values are formatted.
 * - `"href"` — resolves relative URLs against the page origin
 * - `"multiline"` — preserves line breaks (default for strings)
 * - `"singleline"` — collapses whitespace into single spaces
 * - `"innertext"` — uses the element's `innerText`
 * - `"textcontent"` — uses the element's `textContent`
 * - `"none"` — no formatting applied
 */
export type SelectFormat = "href" | "multiline" | "singleline" | "innertext" | "textcontent" | "none";

/**
 * Determines how multiple query results are aggregated for boolean checks.
 * - `"any"` — passes if any query stage matches
 * - `"all"` — passes only if all query stages match
 * - `"none"` — passes only if no query stages match
 */
export type SelectOn = "any" | "all" | "none";
