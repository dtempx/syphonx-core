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
3. **`controller.ts`** → Main orchestrator (~93KB). Dispatches each action by type, manages state mutations, handles yields for async browser operations
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

### Query Format

Selectors in templates follow the pattern: `[["css-selector", ["method", "arg1"], ["method2"]]]`. Methods chain jQuery operations (e.g., `["attr", "href"]`, `["split", ","]`, `["trim"]`). XPath selectors use the `{xpath}` prefix.
