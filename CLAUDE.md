# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

syphonx-core is the core extraction engine for SyphonX — a template-driven HTML-to-JSON data extraction system. It takes a JSON template with CSS/jQuery/XPath selectors and extracts structured data from HTML. It has **no production dependencies** (playwright is used only for tests) and builds to 5 output formats for browser and Node.js use.

## Build & Test

```bash
npm run build     # tsc → Rollup IIFE → Terser minify → jQuery bundle → ESM/CJS/UMD → TypeDoc
npm run test      # mocha -r ./mocha.js (requires build first — tests run against dist/iife bundle)
npm run clean
```

Run a single test:
```bash
npx mocha --grep "online/3"
```

Enable debug output during tests:
```bash
DEBUG=1 npx mocha --grep "each/1"
```

**Important:** You must `npm run build` before running tests. The test harness (`mocha.ts`) loads the compiled IIFE bundle (`dist/iife/syphonx-jquery.min.js`) into the global scope at startup.

## Troubleshooting Tools

```bash
node tools/online examples/1.json                          # run template against its embedded URL
node tools/online examples/1.json --url=https://example.com  # override URL
node tools/offline examples/1.json examples/1.html          # run template against local HTML
node tools/select-html --url=https://example.com --selector=h1
```

## Architecture

### Key Concept: Inside-Out Execution

SyphonX's key differentiator is **inside-out execution** — the extraction engine is able to run *inside* the browser, not from an external Node.js process *(but it can also run from the outside-in)*. Most (if not all) other web scraping tools work "outside-in" by controlling a browser remotely (e.g. via CDP or Playwright's evaluate), but SyphonX injects its entire engine into the page context and runs there. This gives it direct access to the live DOM, jQuery, and the page's JavaScript environment.

The **yield mechanism** supports this model: when the engine (running inside the browser) needs the host to perform an external action — navigate to a URL, go back, take a screenshot — it **yields** control back to the host (Playwright/Node.js), which performs the action and then re-enters the engine. This yield/re-enter cycle is how inside-out execution cooperates with the outside world.

### Execution Flow

1. **Template** → JSON with `actions` array (select, click, transform, each, etc.)
2. **`extract()`/`extractSync()`** → Entry points that initialize `ExtractState` and invoke the controller
3. **`controller.ts`** → Main orchestrator. Dispatches each action by type, manages state mutations, handles yields for async browser operations
4. **`select.ts`** → Executes jQuery/CSS/XPath queries against the DOM
5. **`transform.ts`** → Applies data transformations to extracted results
6. **Result** → `ExtractResult` with `data`, `errors`, `ok`, `metrics`, `html`

### Offline vs Online

- **Offline** — Runs extraction against a cheerio-loaded DOM (Node.js only, no browser). Used for most tests. No yields needed since there are no browser actions.
- **Online** — Runs extraction inside a real browser via Playwright. Uses the yield/re-enter cycle described above for browser actions (click, navigate, screenshot, etc.).

### Source Layout

- **`package/`** — Core engine source
  - `controller.ts` — Action dispatcher and state machine
  - `extract.ts` / `extract-sync.ts` — Async and sync entry points
  - `select.ts` — Query execution
  - `transform.ts` — Data transformations
  - `utilities.ts` — Template flattening, action finding, query merging
  - `public/` — All exported type definitions (`Action`, `Select`, `ExtractState`, etc.)
  - `lib/` — Internal utilities (formula eval, xpath, regex, type coercion, formatting, auto-pagination)
- **`host.ts`** — Browser/Playwright integration layer (navigation, retries, yield loop)
- **`index.ts`** — Export barrel
- **`template.ts`** — `Template` interface definition
- **`schema.json`** — JSON Schema defining the template format
- **`common/`** — Test helpers (`offline()`, `online()`, `select()`, browser utilities)
- **`build-tools/`** — Version stamping, jQuery embedding, template wrapping

### Test Structure

Tests are in `test/<category>/<number>.ts` (e.g., `test/each/1.ts`). Each test file:
1. Defines a template (actions + HTML or URL)
2. Runs it through `offline()` or `online()` from `common/`
3. Asserts on the `ExtractResult`

HTML fixtures live in `test/<category>/content/`. Tests use Chai with chai-as-promised and chai-string plugins.

### Build Outputs

The build produces 5 formats in `dist/`:
- `dist/iife/syphonx.js` — Standalone IIFE (+ jQuery-bundled variant)
- `dist/esm/` — ES modules (with embedded jQuery in host.js)
- `dist/cjs/` — CommonJS (with embedded jQuery in host.js)
- `dist/umd/` — UMD for universal use

---

## Template Reference

> **Full API documentation** is in the [`docs/`](docs/) sub-directory: [`docs/overview.md`](docs/overview.md), [`docs/selectors.md`](docs/selectors.md), [`docs/dynamic-formulas.md`](docs/dynamic-formulas.md), [`docs/key-features.md`](docs/key-features.md), and [`docs/api/`](docs/api/) (generated TypeDoc). The sections below are a quick reference; the `docs/` files are comprehensive.

### Query Format

Selectors follow the pattern: `[["css-selector", ["method", "arg1"], ["method2"]]]`. Methods chain jQuery operations. Multiple stages in the outer array are tried as fallbacks — first match wins (unless `all: true`).

- XPath selectors: prefix with `{xpath}` — e.g. `{xpath}//h1`
- Special targets: `{document}` (document object), `{window}` (window object)
- Dynamic selectors: wrap in `{...}` for JS expression — e.g. `{`#item-${index}`}`

**Common query methods:**
| Method | Description |
|--------|-------------|
| `["attr", "name"]` | Get attribute value; `href`/`src` auto-resolve to absolute URLs |
| `["html"]` | Inner HTML |
| `["text"]` | Text content (trimmed) |
| `["trim"]` | Trim whitespace |
| `["split", ","]` | Split string into array |
| `["replace", "old", "new"]` | String replacement |
| `["extract", "regex"]` | Regex extract (first capture group) |
| `["cut", "delimiter", n]` | Split and take Nth part |
| `["filter", "selector"]` | Keep matching elements |
| `["map", "selector"]` | Transform each element |
| `["is", "selector"]` | Boolean presence check |
| `["json"]` | Parse JSON from text content |
| `["scrollTop"]` | Get scroll position of element |
| `["addClass", "name"]` | Add CSS class (transform only) |

**Format auto-defaulting:** When a query contains `["attr","href"]` or `["attr","src"]` and no explicit `format` is set, `format` defaults to `"href"` (absolute URL resolution).

### Dynamic Formulas

JS expressions wrapped in `{...}` are evaluated at runtime using `jsep`. Available in query selectors, `when` conditions, `value` post-processing, error messages, and transform operations.

**Variables in scope:**
- `value` — result of the preceding query/operation
- `data` — accumulated output object
- `url` — current page URL string
- `params` — template parameters passed at call time
- `_*` — template variables (internal mutable state, stored in `vars` not `data`)

**Examples:**
```js
{`#links a:contains('${_page}')`}      // dynamic CSS selector
{value ? new Date(value).toISOString() : undefined}  // date coercion
{url.split('/')[3]?.toUpperCase()}     // URL-derived value
{data.items.length > 0}               // conditional guard
```

Fields with names starting with `_` are stored in `state.vars` rather than output `data`.

---

## Action Types

All action types that can appear in a template's `actions` array (or nested within `each`/`repeat`/`switch`):

### `select`
Extract named fields from the DOM. The `select` array contains field definitions.

**Per-field options:**
| Option | Type | Description |
|--------|------|-------------|
| `name` | string | Output key (omit for unnamed/projected) |
| `query` | SelectQuery[] | Selector chain(s); fallbacks tried in order |
| `type` | string | `"string"` (default), `"number"`, `"boolean"`, `"object"` |
| `repeated` | boolean | Return array of all matches |
| `required` | boolean | Error if no result |
| `format` | string | `"multiline"`, `"singleline"`, `"href"`, `"innertext"`, `"textcontent"`, `"none"` |
| `distinct` | boolean | Remove duplicates |
| `negate` | boolean | Invert boolean result |
| `all` | boolean | Collect from all query stages (not just first match) |
| `limit` | number | Max nodes to return |
| `pattern` | string | Regex validation |
| `collate` | boolean | Process as single unit |
| `context` | number | DOM context depth (1=parent, null=global) |
| `union` | SelectQuery[] | Alternative selectors merged into field |
| `value` | expression | Post-processing formula |
| `select` | Select[] | Nested sub-selection (for `type:"object"`) |
| `when` | expression | Conditional execution guard |

### `click`
Simulate a user click (online only; bypassed offline).

| Option | Description |
|--------|-------------|
| `query` | Selector(s) for target element |
| `required` | Error if no element found |
| `scroll` | Auto-scroll into view before click (default `true`; set to `false` to skip) |
| `snooze` | `[min, max]` pause; add `"before"`, `"after"`, or `"before-and-after"` as 3rd element |
| `waitfor` | Wait for condition before clicking |
| `waitUntil` | Page load state to wait for after click |
| `yield` | Yield to host after click |
| `when` | Conditional guard |

### `transform`
Mutate the DOM in-place before or between extractions. The `transform` array contains jQuery operations:
- `replaceWith` / `replaceText` / `replaceHTML` — replace element/text/innerHTML
- `addClass` — add CSS class
- `attr` — set attribute
- `wrap` / `filter` / `map` — structural mutations
- Formula expressions have access to `value` (element text) and `data`

### `each`
Iterate over a fixed set of DOM elements; body `actions` run once per element with scoped context.

| Option | Description |
|--------|-------------|
| `query` | Selector to iterate |
| `actions` | Actions to run per element |
| `context` | DOM scope depth |
| `name` | Log label |
| `when` | Conditional guard |

**Context variables inside `each`:** `parent.index` (0-based), `parent.value` (element text), `parent.url` (current URL).

### `repeat`
Loop the same actions up to `limit` count. Used for pagination patterns.

| Option | Description |
|--------|-------------|
| `actions` | Actions to repeat |
| `limit` | Max iterations |
| `errors` | Exit loop if error count reaches this |
| `name` | Log label |
| `when` | Conditional guard |

Repeated `select` fields accumulate across iterations (arrays are merged).

### `break`
Exit a `repeat` loop early when a condition is met (online only; bypassed offline).

| Option | Description |
|--------|-------------|
| `query` | Boolean selector |
| `on` | `"any"` (default), `"all"`, or `"none"` |
| `pattern` | Text pattern the element must satisfy |
| `when` | Formula expression guard |

### `switch`
Run the first matching case; each case has `query` (optional), `actions`, and `when` (optional). A case without `query` acts as fallback/default.

### `error`
Append an error entry (optionally conditional; optionally halt execution).

| Option | Description |
|--------|-------------|
| `message` | Error message (supports formulas) |
| `code` | Error code (default `"app-error"`) |
| `level` | 0=non-retryable fatal, 1=retryable (default), 2+=retryable high |
| `stop` | Halt processing (defaults: stop if level 0, continue otherwise) |
| `query` | Boolean selector — fires when element is absent (or present if `negate:true`) |
| `negate` | Invert query logic |
| `when` | Formula expression trigger |

### `yield`
Yield control to the host for async operations (online only; bypassed offline).

`params` fields:
- `click` — signal preceding click may navigate
- `goback` — browser back
- `navigate` — go to URL
- `reload` — reload page
- `screenshot` — capture page image
- `locators` — array of Playwright locator operations (see YieldLocator below)
- `waitUntil` — load state to wait for (`"load"`, `"domcontentloaded"`, `"networkidle"`, `"commit"`)
- `timeout` — max wait ms

**YieldLocator** (for host-side Playwright operations):
- `name` — variable name (must start with `_`)
- `selector` — CSS selector
- `method` — Playwright locator method (e.g. `"getAttribute"`, `"allTextContents"`)
- `params` — method args
- `frame` — optional iframe scope

### `navigate`
Navigate to a URL (online only).

| Option | Description |
|--------|-------------|
| `url` | Target URL (supports formulas) |
| `waitUntil` | Load state to wait for |
| `when` | Conditional guard |

### `scroll`
Scroll the page (online only).

| Option | Description |
|--------|-------------|
| `target` | `"top"`, `"bottom"`, or omit to use `query` |
| `query` | Selector for element to scroll to |
| `when` | Conditional guard |

### `snooze`
Pause execution (online only; bypassed offline).

| Option | Description |
|--------|-------------|
| `interval` | `[n]` exact seconds or `[min, max]` random range |
| `when` | Conditional guard |

### `waitfor`
Wait for a condition to become true (online only).

| Option | Description |
|--------|-------------|
| `query` | Selector to wait for |
| `required` | Error on timeout |
| `timeout` | Max wait seconds |
| `when` | Conditional guard |

### `keypress`
Simulate keyboard input (online only).

| Option | Description |
|--------|-------------|
| `query` | Target element for focus |
| `key` | Key to press |
| `count` | Repeat count |

### `goback`
Browser back navigation (online only).

### `reload`
Page reload (online only).

### `screenshot`
Capture a screenshot (online only); result stored in `vars`.

### `locator`
Run a Playwright locator operation and store result in a `_var` (online only).

---

## Output Interfaces

### ExtractResult

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | True if no errors |
| `data` | object | Extracted output |
| `errors` | ExtractError[] | Error log |
| `vars` | object | Template variables (`_*` fields) |
| `url` | string | Final page URL |
| `domain` | string | Registered domain |
| `origin` | string | Protocol + host |
| `status` | number | HTTP status code |
| `html` | string | Serialized page HTML (if captured) |
| `version` | string | Engine version |
| `online` | boolean | True when run in browser mode |
| `metrics` | object | Performance diagnostics |

### Metrics

| Field | Description |
|-------|-------------|
| `elapsed` | Total wall-clock time (ms) |
| `actions` | Total action count (recursive) |
| `steps` | Action steps executed |
| `clicks` | Click actions run |
| `queries` | DOM queries executed |
| `navigate` | Time in navigation (ms) |
| `snooze` | Time in snooze (ms) |
| `waitfor` | Time in waitfor (ms) |
| `yields` | Times engine yielded to host |
| `errors` | Total error count |
| `timeouts` | Waitfor timeouts |
| `skipped` | Conditional steps skipped |
| `retries` | Navigation retries |
| `renavigations` | Re-navigations to URL |

### Error Codes

| Code | Meaning |
|------|---------|
| `app-error` | User-defined error from template |
| `click-timeout` | Click waitfor timed out |
| `click-required` | Required click found no element |
| `error-limit` | Repeat loop exceeded error limit |
| `eval-error` | Formula evaluation failed |
| `external-error` | External system error |
| `fatal-error` | Uncaught exception |
| `host-error` | Host callback failed |
| `invalid-select` | Select definition malformed |
| `invalid-operator` | Unknown jQuery operator |
| `invalid-operand` | Invalid operator argument |
| `select-required` | Required select returned nothing |
| `waitfor-timeout` | Waitfor condition not met in time |

---

## Common Patterns

### Pagination with repeat + click + yield
```json
{ "repeat": { "limit": 5, "actions": [
    { "select": [{ "name": "items", "repeated": true, "query": [[".item"]] }] },
    { "click": { "query": [["a.next"]] } },
    { "yield": { "params": { "waitUntil": "domcontentloaded" } } }
]}}
```
Repeated `select` arrays are merged across iterations.

### Conditional execution with `when`
```json
{ "select": [{ "name": "price", "query": [[".price"]], "when": "{data.type === 'product'}" }] }
```

### Dynamic URL from params
```json
{ "url": "{`https://example.com/items/${params.id}/`}" }
```

### Nested object extraction
```json
{ "name": "product", "type": "object", "repeated": true, "query": [[".product"]], "select": [
    { "name": "title", "query": [["h2"]] },
    { "name": "price", "query": [[".price"]], "type": "number" }
]}
```

### Using `_` variables as internal state
Fields with names starting with `_` go to `vars` (not `data`) and can be referenced in formulas as `_varname`.
