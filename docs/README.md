# How SyphonX Templates Work

A SyphonX template is a JSON document with an `actions` array. The most common action is `select`, which defines fields to extract.

```json
{
    "url": "https://example.com",
    "actions": [
        { "select": [ ...fields ] },
        { "click": [ ...elements ] },
        { "transform": [ ...mutations ] }
    ]
}
```

## The Selector Format

Selectors are condensed arrays that chain a CSS/jQuery selector with method calls:

```json
[["css-selector", ["method", "arg1"], ["method2"]]]
```

For example, to get the `href` attribute of the first link:

```json
{ "name": "url", "query": [["a", ["attr", "href"]]] }
```

The `query` is a *double-nested* array for a reason: the **inner** array is one selector plus a chain of methods, and the **outer** array is a **selector chain** — an ordered list of fallback stages. SyphonX tries each stage in order and the first that matches wins. This lets one field probe several different places in the DOM, which is essential on large sites where the same value appears in different markup across page types, brands, or site generations:

```json
{ "name": "price", "query": [["#sale-price"], ["#retail-price"], [".price"]] }
```

See [selectors.md](selectors.md) for the full selector reference — methods, XPath, fallback selector chains (and the lighter-weight CSS comma alternative), `all: true`, and nested/list selectors. For a dedicated XPath guide, see [xpath.md](xpath.md).

## Dynamic Formulas

String values in templates can contain JavaScript expressions wrapped in `{...}`, evaluated at runtime:

```json
{ "name": "lastmod", "query": [[".date"]], "value": "{value ? new Date(value).toISOString() : undefined}" }
```

Formulas have access to `value` (the extracted result), `data` (accumulated output), `url`, `params`, and internal state variables prefixed with `_`. They can be used in selectors, `when` conditions, `value` post-processing, and more:

```json
{ "break": { "when": "{_page_num >= _page_count}" } }
```

See [dynamic-formulas.md](dynamic-formulas.md) for the full reference (and the variables-in-scope table), [complex-formulas.md](complex-formulas.md) for the in-depth field-guide (using built-in JavaScript, pattern catalog, worklist state machines, gotchas), [escaping.md](escaping.md) for the backslash/quote "JSON tax", [data-context.md](data-context.md) for how the `data` variable is rooted and resolved, [value-postprocessing.md](value-postprocessing.md) for combining a `query` with a `value` formula, [value-wrappers.md](value-wrappers.md) for the `obj.href.value` quirk when post-processing a repeated array, and [internal-state-variables.md](internal-state-variables.md) for how `_`-prefixed variables hold working state across actions.

## Field Options

Each field in a `select` action can have these options:

```json
{
    "name": "fieldName",
    "type": "string",
    "query": [["css-selector"]],
    "repeated": false,
    "required": false
}
```

| Option | Type | Default | Purpose |
|---|---|---|---|
| `name` | string | — | Output key name |
| `type` | string | `"string"` | `"string"`, `"number"`, `"boolean"`, or `"object"` |
| `query` | array | — | Selector chain(s) |
| `repeated` | boolean | `false` | Return an array of all matches |
| `required` | boolean | `false` | Error if nothing found |
| `format` | string | `"multiline"` | `"multiline"`, `"singleline"`, `"href"`, `"innertext"`, `"textcontent"`, `"none"` |
| `distinct` | boolean | `false` | Remove duplicates from arrays |
| `negate` | boolean | `false` | Invert boolean result |
| `all` | boolean | `false` | Include matches from all query chains |

## Examples

### Extract text
```json
{ "name": "title", "query": [["h1"]] }
```
`<h1>Hello World</h1>` → `"Hello World"`

### Extract a number (auto-parses from text)
```json
{ "name": "price", "type": "number", "query": [["#price"]] }
```
`<div id="price">Price $9.99</div>` → `9.99`

### Check if an element exists
```json
{ "name": "inStock", "type": "boolean", "query": [[".in-stock"]] }
```
Element found → `true`, not found → `false`

### Get an attribute
```json
{ "name": "url", "query": [["a", ["attr", "href"]]], "format": "href" }
```
`<a href="/page">Link</a>` → `"https://example.com/page"` (resolved to absolute URL with `format: "href"`)

### Extract with regex
```json
{ "name": "colors", "repeated": true, "query": [["li", ["extract", "/color: ([a-z]+)/"]]] }
```
```html
<li>color: red</li>
<li>color: green</li>
<li>size: small</li>
```
→ `["red", "green"]` (non-matching items are skipped)

### Split a string
```json
{ "name": "first", "query": [["div", ["cut", ",", 0]]] }
```
`<div>red, orange, green, blue</div>` → `"red"`

Use `-1` to get the last part, `-2` for second-to-last, etc.

### Regex replace
```json
{ "name": "cleaned", "query": [["div", ["replace", "/[0-9]+/g", ""]]] }
```
`<div>abc 123 def 456</div>` → `"abc  def "`

### Extract a list
```json
{ "name": "items", "repeated": true, "query": [["ul > li"]] }
```
```html
<ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>
```
→ `["Apple", "Banana", "Cherry"]`

### Extract an object
```json
{
    "name": "product",
    "type": "object",
    "query": [[".product"]],
    "select": [
        { "name": "name", "query": [[".name"]] },
        { "name": "type", "query": [[".type"]] }
    ]
}
```
```html
<div class="product">
    <span class="name">apple</span>
    <span class="type">fruit</span>
</div>
```
→ `{ "name": "apple", "type": "fruit" }`

## Other Actions

Beyond [**`select`**](api/interfaces/Select.md), templates support:

- [**`click`**](api/interfaces/Click.md) — Click elements (for dynamic content, pagination)
- [**`transform`**](api/interfaces/Transform.md) — Modify the DOM before selecting (remove elements, replace text)
- [**`navigate`**](api/interfaces/Navigate.md) — Go to another URL
- [**`each`**](api/interfaces/Each.md) — Loop over elements, running nested actions per element
- [**`repeat`**](api/interfaces/Repeat.md) — Loop with break conditions
- [**`switch`**](api/interfaces/Switch.md) — Run the first matching case
- [**`scroll`**](api/interfaces/Scroll.md) — Scroll the page
- [**`keypress`**](api/interfaces/KeyPress.md) — Simulate keyboard input

Conditional execution via the `when` option is available on most actions and fields — see [dynamic-formulas.md](dynamic-formulas.md). For the complete action catalog (including `error`, `break`, `snooze`, `waitfor`, `goback`, `reload`, `yield`, `locator`), see [features.md](features.md).

## Documentation Map

This page is the introduction. The rest of the docs go deeper, grouped by topic:

**Overview**
- [features.md](features.md) — the comprehensive reference: every action, field option, output interface, error code, and metric in one place
- [key-features.md](key-features.md) — what makes SyphonX different, at a glance
- [why-not-ai.md](why-not-ai.md) — when selector-based extraction beats an LLM

**Selectors**
- [selectors.md](selectors.md) — the selector array format, methods, fallbacks, `all`, nested/list selectors, inline text
- [xpath.md](xpath.md) — XPath selector support and its limitations

**Dynamic formulas** (`{...}` expressions)
- [dynamic-formulas.md](dynamic-formulas.md) — the hub and quick reference, including the variables-in-scope table
- [complex-formulas.md](complex-formulas.md) — the deep-dive field-guide: pattern catalog, state-machine iteration, gotchas
- [escaping.md](escaping.md) — the "JSON tax": doubling backslashes, quotes in regex
- [data-context.md](data-context.md) — how the `data` variable is rooted and what is visible when
- [value-postprocessing.md](value-postprocessing.md) — combining a `query` with a `value` formula
- [value-wrappers.md](value-wrappers.md) — the `obj.field.value` quirk when post-processing a repeated array
- [internal-state-variables.md](internal-state-variables.md) — `_`-prefixed variables that hold working state across actions

**Runtime behavior**
- [timeouts.md](timeouts.md) — the layered timeout system and `waitUntil` (online mode)

**API**
- [API Reference](api/README.md) — generated TypeDoc for all public interfaces
