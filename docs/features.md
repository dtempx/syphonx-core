# SyphonX Features

A comprehensive reference of all features in syphonx-core, derived from the public interfaces and types.

---

## Core Concepts

- **Flexible selectors** — chain CSS, jQuery, and XPath with built-in methods like `attr`, `extract` (regex capture), `replace`, `cut`, `json`, and more; define fallback selectors that try alternatives in order ([selector reference](./docs/selectors.md))
- **Dynamic formulas** — embed JavaScript expressions directly in your JSON template to compute selectors at runtime, transform values, branch conditionally, or drive pagination loops ([formula reference](./docs/dynamic-formulas.md))
- **Rich action set** — beyond `select`: `click`, `navigate`, `scroll`, `keypress`, `each` (loop over elements), `repeat` (loop with break conditions), `transform` (reshape the DOM before selecting), and `switch`/`when` for conditional branching
- **Nested objects and arrays** — extract structured objects with nested `select` blocks, collect repeated items into arrays, or gather results across multiple selectors with `all: true`
- **Dynamic content** — click buttons, wait for elements to appear, paginate through multi-page results, all driven by the same declarative template
- **Works anywhere** — inject into Playwright or Puppeteer, run from a browser console, or process offline HTML files with zero production dependencies ([key features](./docs/key-features.md))


### Inside-Out Execution
Unlike most scraping tools that control a browser remotely ("outside-in"), SyphonX injects its entire extraction engine *into* the page context and runs there. This gives it direct access to the live DOM, jQuery, and the page's JavaScript environment. When the engine needs the host to perform an external action (navigate, go back, take a screenshot), it **yields** control back to the host (e.g. Playwright), which performs the action and re-enters the engine.

### Offline vs Online Modes
- **Offline** — Runs against a cheerio-loaded DOM in Node.js. No browser required. Used for processing stored HTML files. Browser-only actions (click, scroll, navigate, etc.) are bypassed.
- **Online** — Runs inside a real browser via Playwright. Supports the full action set including browser interactions, navigation, and screenshots.

### Zero Dependencies
The core engine has no production dependencies. It builds to 5 output formats for use as a browser `<script>` tag (IIFE), ES module, CommonJS, or UMD bundle.

---

## Template Structure

A template is a JSON object with these top-level properties:

| Property | Type | Description |
|----------|------|-------------|
| `actions` | `Action[]` | Ordered list of actions to execute |
| `url` | string | Default URL to navigate to before extraction; supports formula expansion |
| `params` | object | Template-level parameters accessible in formulas as `params.<key>` |
| `vars` | object | Initial variables merged into extraction state |
| `timeout` | number | Navigation timeout in seconds |
| `waitUntil` | string | Default page load state to wait for during navigation (`"load"`, `"domcontentloaded"`, `"networkidle"`, `"commit"`) |
| `headers` | object | Custom HTTP headers for all page requests (online mode) |
| `useragent` | string | Browser User-Agent string (online mode) |
| `viewport` | object | Browser viewport dimensions `{ width, height }` (online mode) |
| `unpatch` | string[] | Browser API paths to restore from an unpatched iframe, bypassing site monkey-patching |
| `debug` | boolean | Enable verbose debug logging throughout extraction |

---

## Actions

### `select` — Extract Data

Extract named fields from the DOM. The core action for all data extraction.

**Per-field options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | — | Output key name; omit for unnamed/projected fields |
| `query` | SelectQuery[] | — | Selector chain(s); multiple chains are tried as fallbacks |
| `type` | string | `"string"` | `"string"`, `"number"`, `"boolean"`, or `"object"` |
| `repeated` | boolean | `false` | Return an array of all matches |
| `required` | boolean | `false` | Emit an error if nothing is found |
| `format` | string | `"multiline"` | `"singleline"`, `"multiline"`, `"href"`, `"innertext"`, `"textcontent"`, `"none"` |
| `distinct` | boolean | `false` | Remove duplicate values from arrays |
| `negate` | boolean | `false` | Invert boolean results |
| `all` | boolean | `false` | Collect matches from all query chains, not just the first match |
| `limit` | number | — | Maximum number of nodes to return |
| `pattern` | string | — | Regex pattern for validating the extracted value |
| `collate` | boolean | `false` | Process matched elements as a single unit |
| `context` | number | — | DOM context scope depth (1 = parent element, null = global) |
| `union` | SelectQuery[] | — | Additional selectors whose results are merged into this field |
| `value` | expression | — | Formula applied to the extracted value as post-processing |
| `select` | Select[] | — | Nested sub-selection for `type: "object"` fields |
| `when` | expression | — | Conditional guard; field is skipped when the expression is falsy |

**Format auto-defaulting:** When a query contains `["attr","href"]` or `["attr","src"]` and no explicit `format` is set, `format` defaults to `"href"` (absolute URL resolution).

**Repeated select accumulation:** When a `select` action is inside a `repeat` loop, arrays are merged across iterations.

---

### `click` — Click Elements (online)

Simulate a user click on a DOM element. Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `query` | SelectQuery[] | Selector(s) for the target element |
| `required` | boolean | Emit an error if no element is found |
| `scroll` | boolean | Auto-scroll the element into view before clicking (default `true`) |
| `snooze` | array | `[min, max]` pause with optional timing `"before"`, `"after"`, or `"before-and-after"` as 3rd element |
| `waitfor` | object | Wait for a condition before clicking |
| `waitUntil` | string | Page load state to wait for after the click |
| `yield` | object | Yield to host after the click |
| `when` | expression | Conditional guard |

---

### `transform` — Mutate the DOM

Modify the DOM in-place before or between extractions. Transform operations run as jQuery method chains. Available operations:

| Operation | Description |
|-----------|-------------|
| `replaceWith` | Replace the element entirely |
| `replaceText` | Replace text content |
| `replaceHTML` | Replace inner HTML |
| `addClass` | Add a CSS class |
| `attr` | Set an attribute |
| `wrap` | Wrap elements in a new element |
| `filter` | Remove non-matching elements |
| `map` | Transform each element |

Formulas in transform operations have access to `value` (current element text) and `data` (accumulated output).

---

### `each` — Iterate Over Elements

Iterate over a fixed set of DOM elements; the body `actions` run once per element with a scoped context.

| Option | Type | Description |
|--------|------|-------------|
| `query` | SelectQuery[] | Selector to iterate over |
| `actions` | Action[] | Actions to run per element |
| `context` | number | DOM scope depth |
| `name` | string | Optional label for log output |
| `when` | expression | Conditional guard |

**Context variables inside `each`:**
- `parent.index` — 0-based iteration index
- `parent.value` — text content of the current element
- `parent.url` — current page URL

---

### `repeat` — Loop Actions

Loop the same actions up to a `limit` count. Used for pagination and retry patterns.

| Option | Type | Description |
|--------|------|-------------|
| `actions` | Action[] | Actions to repeat |
| `limit` | number | Maximum number of iterations |
| `errors` | number | Exit the loop when the error count reaches this value |
| `name` | string | Optional label for log output |
| `when` | expression | Conditional guard |

---

### `break` — Exit a Repeat Loop (online)

Exit a `repeat` loop early when a condition is met. Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `query` | SelectQuery[] | Boolean selector |
| `on` | string | `"any"` (default), `"all"`, or `"none"` |
| `pattern` | string | Text pattern the element must satisfy |
| `when` | expression | Formula expression guard |

---

### `switch` — Conditional Branching

Run the first matching case. Each case has an optional `query`, `actions`, and optional `when` guard. A case without `query` acts as a fallback/default.

---

### `error` — Emit an Error

Append an error entry, optionally conditional and optionally halting execution.

| Option | Type | Description |
|--------|------|-------------|
| `message` | string | Error message; supports formula expressions |
| `code` | string | Error code (default `"app-error"`) |
| `level` | number | `0` = non-retryable fatal; `1` = retryable (default); `2+` = retryable high severity |
| `stop` | boolean | Halt processing (default: stop on level 0, continue otherwise) |
| `query` | SelectQuery[] | Boolean selector — fires when element is absent (or present if `negate: true`) |
| `negate` | boolean | Invert query logic |
| `when` | expression | Formula expression trigger |

---

### `navigate` — Go to a URL (online)

Navigate to a URL. Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `url` | string | Target URL; supports formula expressions |
| `waitUntil` | string | Page load state to wait for |
| `when` | expression | Conditional guard |

---

### `scroll` — Scroll the Page (online)

Scroll the page to a position or element. Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `target` | string | `"top"`, `"bottom"`, or omit to use `query` |
| `query` | SelectQuery[] | Selector for the element to scroll to |
| `when` | expression | Conditional guard |

---

### `screenshot` — Capture a Screenshot (online)

Capture a screenshot of the page; the result is stored in `vars`. Bypassed in offline mode.

---

### `snooze` — Pause Execution (online)

Pause execution for a fixed or random interval. Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `interval` | array | `[n]` exact seconds or `[min, max]` random range |
| `when` | expression | Conditional guard |

---

### `waitfor` — Wait for a Condition (online)

Wait for a DOM condition to become true. Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `query` | SelectQuery[] | Selector to wait for |
| `required` | boolean | Emit an error on timeout |
| `timeout` | number | Maximum wait time in seconds |
| `when` | expression | Conditional guard |

---

### `keypress` — Simulate Keyboard Input (online)

Simulate keyboard input. Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `query` | SelectQuery[] | Target element for focus |
| `key` | string | Key to press |
| `count` | number | Number of times to press the key |

---

### `goback` — Browser Back Navigation (online)

Navigate the browser back in history (`page.goBack()`). Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `name` | string | Optional label for log output |
| `when` | expression | Conditional guard |

---

### `reload` — Reload the Page (online)

Reload the current page (`page.reload()`). Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `waitUntil` | string | Page load state to wait for: `"load"`, `"domcontentloaded"`, `"networkidle"` |
| `name` | string | Optional label for log output |
| `when` | expression | Conditional guard |

---

### `yield` — Yield to Host (online)

Yield control to the Playwright host for an asynchronous operation, then re-enter the engine. Bypassed in offline mode.

**`params` fields:**

| Field | Description |
|-------|-------------|
| `click` | Signal that a preceding click may trigger navigation |
| `goback` | Perform browser back navigation |
| `navigate` | Go to a URL |
| `reload` | Reload the current page |
| `screenshot` | Capture a page screenshot |
| `locators` | Array of Playwright locator operations (see `locator` action) |
| `waitUntil` | Page load state to wait for |
| `timeout` | Maximum wait time in ms |

---

### `locator` — Run a Playwright Locator (online)

Run a Playwright locator operation and store the result in a `_var`. Bypassed in offline mode.

| Option | Type | Description |
|--------|------|-------------|
| `name` | string | Variable name for the result (must start with `_`) |
| `selector` | string | CSS selector passed to `page.locator()`; supports expression evaluation |
| `method` | string | Playwright Locator method to invoke (e.g. `"getAttribute"`, `"allTextContents"`, `"innerHTML"`) |
| `params` | array | Parameters passed to the locator method |
| `frame` | string | Selector for `page.frameLocator()` to target an iframe |
| `chain` | boolean | Operate within the scope of the previous locator instead of the full page |
| `promote` | boolean | Promote a shadow root into the top-level DOM for subsequent selectors |
| `when` | expression | Conditional guard |

---

## Selector Format

Selectors follow the pattern `[["css-selector", ["method", "arg1"], ...]]`. Methods chain jQuery operations. Multiple selector chains act as fallbacks — the first match wins (unless `all: true`).

### Selector Prefixes

| Prefix | Description |
|--------|-------------|
| `{xpath}` | XPath selector — e.g. `{xpath}//h1` |
| `{document}` | The document object |
| `{window}` | The window object |
| `{...}` | Dynamic JS expression — e.g. `` {`#item-${index}`} `` |

### Query Methods (Operators)

| Method | Description |
|--------|-------------|
| `["attr", "name"]` | Get an attribute value; `href`/`src` auto-resolve to absolute URLs |
| `["html"]` | Inner HTML of the element |
| `["text"]` | Text content (trimmed) |
| `["trim"]` | Trim leading/trailing whitespace |
| `["split", ","]` | Split string into an array |
| `["replace", "pattern", "replacement"]` | String or regex replacement |
| `["extract", "/regex/"]` | Regex extraction (returns first capture group) |
| `["cut", "delimiter", n]` | Split on delimiter and take the Nth part (negative indices count from end) |
| `["filter", "selector"]` | Keep only elements matching the selector |
| `["map", "selector"]` | Transform each element |
| `["is", "selector"]` | Boolean presence check |
| `["json"]` | Parse JSON from text content |
| `["scrollTop"]` | Get the scroll position of an element |
| `["addClass", "name"]` | Add a CSS class (transform context only) |

---

## Dynamic Formulas

String values wrapped in `{...}` are evaluated at runtime as JavaScript expressions using `jsep`. Formulas are available in:
- Query selectors (dynamic selectors)
- `when` conditions
- `value` post-processing
- Error messages
- Transform operations
- URL fields in `navigate`

**Variables in scope:**

| Variable | Description |
|----------|-------------|
| `value` | Result of the preceding query or operation |
| `data` | Accumulated output object so far |
| `url` | Current page URL string |
| `params` | Template parameters passed at call time |
| `_*` | Template variables — fields with `_`-prefixed names (stored in `vars`, not `data`) |

**Examples:**
```js
{`#links a:contains('${_page}')`}            // dynamic CSS selector
{value ? new Date(value).toISOString() : undefined}  // date coercion
{url.split('/')[3]?.toUpperCase()}           // URL-derived value
{data.items.length > 0}                      // conditional guard
{_page_num >= _page_count}                   // break condition
```

---

## Output

### `ExtractResult`

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | `true` if no errors occurred |
| `data` | object | Extracted output keyed by field names |
| `errors` | ExtractError[] | List of errors encountered |
| `vars` | object | Template variables (`_`-prefixed fields) |
| `url` | string | Final page URL |
| `domain` | string | Registered domain |
| `origin` | string | Protocol + host |
| `status` | number | HTTP status code from the last navigation (0 in offline mode) |
| `html` | string | Serialized page HTML snapshot (when configured) |
| `version` | string | Extraction engine version |
| `online` | boolean | `true` when run in browser mode |
| `metrics` | Metrics | Performance and diagnostic metrics |

### `ExtractError`

| Field | Type | Description |
|-------|------|-------------|
| `code` | string | Error code (see table below) |
| `message` | string | Human-readable description |
| `level` | number | Severity: `0` = fatal, `1` = retryable, `2+` = retryable high |
| `key` | string | Hierarchical context key where the error occurred (e.g. `"items.name"`) |
| `stack` | string | Stack trace, when the error originated from a caught exception |

**Error codes:**

| Code | Meaning |
|------|---------|
| `app-error` | User-defined error from an `error` action |
| `click-timeout` | Click `waitfor` condition timed out |
| `click-required` | Required click found no element |
| `error-limit` | `repeat` loop exceeded its error limit |
| `eval-error` | Formula evaluation failed |
| `external-error` | Error from an external system |
| `fatal-error` | Uncaught exception in the engine |
| `host-error` | Host callback failed |
| `invalid-select` | Select definition is malformed |
| `invalid-operator` | Unknown jQuery operator |
| `invalid-operand` | Invalid argument to an operator |
| `select-required` | Required select returned nothing |
| `waitfor-timeout` | Waitfor condition not met within the timeout |

### `Metrics`

| Field | Type | Description |
|-------|------|-------------|
| `elapsed` | number | Total wall-clock time for the run (ms) |
| `actions` | number | Total actions in the template (recursive count) |
| `steps` | number | Total action steps executed |
| `clicks` | number | Click actions executed |
| `queries` | number | DOM queries executed |
| `navigate` | number | Cumulative navigation wait time (ms) |
| `snooze` | number | Cumulative snooze time (ms) |
| `waitfor` | number | Cumulative waitfor time (ms) |
| `yields` | number | Times the engine yielded to the host |
| `errors` | number | Total errors encountered |
| `timeouts` | number | Waitfor timeouts |
| `skipped` | number | Steps skipped due to `when` conditions |
| `retries` | number | Navigation retry attempts |
| `renavigations` | number | Re-navigations to a URL |

---

## Common Patterns

### Pagination with `repeat` + `click` + `yield`
```json
{ "repeat": { "limit": 10, "actions": [
    { "select": [{ "name": "items", "repeated": true, "query": [[".item"]] }] },
    { "click": { "query": [["a.next"]] } },
    { "yield": { "params": { "waitUntil": "domcontentloaded" } } }
]}}
```

### Conditional execution with `when`
```json
{ "select": [{ "name": "price", "query": [[".price"]], "when": "{data.type === 'product'}" }] }
```

### Dynamic URL from params
```json
{ "navigate": { "url": "{`https://example.com/items/${params.id}/`}" } }
```

### Nested object extraction
```json
{ "name": "product", "type": "object", "repeated": true, "query": [[".product"]], "select": [
    { "name": "title", "query": [["h2"]] },
    { "name": "price", "query": [[".price"]], "type": "number" }
]}
```

### Click into detail pages and go back
```json
[
    { "click": { "query": [["a.detail-link"]] } },
    { "select": [{ "name": "detail", "query": [["#content"]] }] },
    { "goback": {} }
]
```

### Internal state variables
Fields with names starting with `_` are stored in `state.vars` (not `data`) and referenced in formulas as `_varname`. Useful for counters, flags, and intermediate values that should not appear in the output.

### Shadow DOM access via `locator`
```json
{ "locator": [{ "name": "_shadow_html", "selector": "my-component", "promote": true }] }
```
After `promote`, the shadow root's contents are accessible to subsequent CSS/jQuery selectors.

### Fallback selectors
Multiple selector chains are tried in order; the first match wins:
```json
{ "name": "price", "query": [["#sale-price"], ["#retail-price"], [".price"]] }
```
