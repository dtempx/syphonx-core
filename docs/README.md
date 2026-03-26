syphonx-core / [Exports](modules.md)

# SyphonX

**Template-driven HTML to JSON extraction.** Define what you want with jQuery selectors in a declarative JSON template, get structured data back.

## Overview

SyphonX takes a JSON template with CSS/jQuery selectors and extracts structured data from any HTML — live pages or offline files. No imperative code, just a declarative template.

**Input HTML:**
```html
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples.</p>
    <a href="https://www.iana.org/domains/example">More information...</a>
</div>
```

**Template:**
```json
{
    "actions": [
        {
            "select": [
                { "name": "title", "query": [["h1"]] },
                { "name": "link", "query": [["a", ["attr", "href"]]] }
            ]
        }
    ]
}
```

**Output:**
```json
{
    "title": "Example Domain",
    "link": "https://www.iana.org/domains/example"
}
```

## How Templates Work

A template is a JSON object with an `actions` array. The most common action is `select`, which defines fields to extract.

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

Selectors are condensed arrays that chain a CSS selector with jQuery-style operations:

```
[["css-selector", ["method", "arg1", "arg2"], ["method2", "arg1"]]]
```

The first element is always a CSS/jQuery selector string. Each subsequent array is a method call applied to the result.

### Basic Selectors

| Array Form | jQuery Equivalent | Extracts |
|---|---|---|
| `[["h1"]]` | `$("h1")` | Text content of first `<h1>` |
| `[["#price"]]` | `$("#price")` | Text of element with id `price` |
| `[[".product-name"]]` | `$(".product-name")` | Text of first element with class `product-name` |
| `[["h3:contains('Price')"]]` | `$("h3:contains('Price')")` | Text of `<h3>` containing "Price" |
| `[["h1 ~ p"]]` | `$("h1 ~ p")` | Text of `<p>` sibling after `<h1>` |

### Methods

Chain methods after the selector to transform the extracted value:

| Method | Example | jQuery Equivalent | Result |
|---|---|---|---|
| `attr` | `[["a", ["attr", "href"]]]` | `$("a").attr("href")` | Get an attribute value |
| `extract` | `[["li", ["extract", "/color: ([a-z]+)/"]]]` | `$("li").extract("/color: ([a-z]+)/")` | Regex capture group |
| `replace` | `[["div", ["replace", "/[0-9]+/g", "::"]]]` | `$("div").replace("/[0-9]+/g", "::")` | Regex replace |
| `cut` | `[["div", ["cut", ",", 0]]]` | `$("div").cut(",", 0)` | Split by delimiter, get Nth part |
| `html` | `[["div", ["html"]]]` | `$("div").html()` | Inner HTML instead of text |
| `is` | `[["a", ["is", ".active"]]]` | `$("a").is(".active")` | Boolean: matches selector? |
| `filter` | `[["li", ["filter", "/^item/"]]]` | `$("li").filter("/^item/")` | Keep elements matching regex |
| `json` | `[["script", ["json", "{value.data}"]]]` | `$("script").json("{value.data}")` | Parse JSON, extract path |

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
| `format` | string | `"multiline"` | `"singleline"`, `"href"`, `"none"` |
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

### Multiple Selectors

A `query` is an array of selectors. Each inner array is a separate jQuery selector chain:

```json
{ "name": "title", "query": [["h1"], ["h2"], [".title"]] }
```

This is equivalent to defining three jQuery selectors:
```
$("h1")
$("h2")
$(".title")
```

By default, selectors run in order and **the first one that produces a result wins**. This is useful for fallback logic — try the most specific selector first, then fall back to alternatives:

```json
{ "name": "price", "query": [["#sale-price"], ["#retail-price"], [".price"]] }
```
Equivalent to trying `$("#sale-price")`, then `$("#retail-price")`, then `$(".price")` — stopping at the first match.

#### Gathering results from all selectors

Set `"all": true` to run **every** selector and combine all results instead of stopping at the first match:

```json
{ "name": "links", "repeated": true, "all": true, "query": [["nav a", ["attr", "href"]], ["footer a", ["attr", "href"]]] }
```
Equivalent to running both `$("nav a").attr("href")` and `$("footer a").attr("href")` and merging the results into a single array.

## Other Actions

Beyond `select`, templates support:

- **`click`** — Click elements (for dynamic content, pagination)
- **`transform`** — Modify the DOM before selecting (remove elements, replace text)
- **`navigate`** — Go to another URL
- **`each`** — Loop over elements, running nested actions per element
- **`switch`/`when`** — Conditional execution
- **`repeat`** — Loop with break conditions
- **`scroll`** — Scroll the page
- **`keypress`** — Simulate keyboard input

## Key Features

- **Zero dependencies** — runs in-browser or offline against raw HTML
- **jQuery + Regex + JavaScript** — no glass ceiling on what you can select or transform (if it works in jQuery it works in SyphonX)
- **Works anywhere** — inject into Playwright, Puppeteer, browser console, or use standalone
- **Offline extraction** — process stored HTML files without a browser
- **Dynamic content** — click, scroll, wait for elements, handle pagination
- **Inside-out execution** — unlike most scraping tools that control a browser remotely from an external process ("outside-in"), SyphonX injects its entire extraction engine *into* the page context and runs there. This gives it direct access to the live DOM, jQuery, and the page's JavaScript environment. When the engine needs the host to perform an external action (navigate, go back, take a screenshot), it **yields** control back to the host (e.g. Playwright), which performs the action and re-enters the engine. This yield/re-enter cycle is how inside-out execution cooperates with the outside world — while still supporting traditional outside-in execution as well.
