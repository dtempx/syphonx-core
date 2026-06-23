# SyphonX Selector Format

Selectors are condensed arrays that chain a CSS selector with jQuery-style operations:

```
[["css-selector", ["method", "arg1", "arg2"], ["method2", "arg1"]]]
```

The first element is always a CSS/jQuery selector string. Each subsequent array is a method call applied to the result.

## Basic Selectors

| Array Form | jQuery Equivalent | Extracts |
|---|---|---|
| `[["h1"]]` | `$("h1")` | Text content of first `<h1>` |
| `[["#price"]]` | `$("#price")` | Text of element with id `price` |
| `[[".product-name"]]` | `$(".product-name")` | Text of first element with class `product-name` |
| `[["h3:contains('Price')"]]` | `$("h3:contains('Price')")` | Text of `<h3>` containing "Price" |
| `[["h1 ~ p"]]` | `$("h1 ~ p")` | Text of `<p>` sibling after `<h1>` |

## Methods

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
| `text` | `[["p", ["text", "inline"]]]` | — | Direct text only, skipping child element text (see below) |

## Multiple Selectors

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

### Gathering results from all selectors

Set `"all": true` to run **every** selector and combine all results instead of stopping at the first match:

```json
{ "name": "links", "repeated": true, "all": true, "query": [["nav a", ["attr", "href"]], ["footer a", ["attr", "href"]]] }
```

Equivalent to running both `$("nav a").attr("href")` and `$("footer a").attr("href")` and merging the results into a single array.

## Inline Text Extraction

By default, extracting text from an element returns all text content including text from child elements. Use `["text", "inline"]` to extract **only the direct text nodes** of an element, ignoring text inside child elements.

```json
{ "name": "label", "query": [["p", ["text", "inline"]]] }
```

Given this HTML:
```html
<p>Price: <strong>$19.99</strong> each</p>
```

| Query | Result |
|---|---|
| `[["p"]]` | `"Price: $19.99 each"` |
| `[["p", ["text", "inline"]]]` | `"Price: each"` |

This is useful when an element mixes label text with embedded values and you only want the surrounding text, not the value inside a child element. Another common use is targeting the current element's own text when nested elements would otherwise pollute the result:

```json
{ "name": "category", "query": [[".", ["text", "inline"]]] }
```

```html
<li>Clothing <span class="count">(42)</span></li>
```
→ `"Clothing"`

## XPath Selectors

XPath selectors are supported using the `xpath:` prefix:

```json
{ "name": "title", "query": [["xpath://h1"]] }
```

> Alternatively, any selector that starts with a `/` is assumed to be an XPath selector

## Nested Selectors

Set `"type": "object"` with a nested `select` array to extract a structured object instead of a single value. The outer `query` matches an element, and that element becomes the **context** for each nested selector — the nested queries run scoped to it.

```json
{
    "name": "a1",
    "type": "object",
    "query": [["div"]],
    "select": [
        { "name": "name", "query": [[".name"]] },
        { "name": "type", "query": [[".type"]] }
    ]
}
```

Given this HTML:
```html
<section>
    <div>
        <span class="name">apple</span>
        <span class="type">fruit</span>
    </div>
</section>
```

Produces:
```json
{ "a1": { "name": "apple", "type": "fruit" } }
```

Combine `"type": "object"` with `"repeated": true` when the outer `query` matches multiple elements to produce an array of objects, one per matched element.

## List Selectors

Add `"repeated": true` to a [nested selector](#nested-selectors) to extract a **list of objects** — one for each element the outer `query` matches. Each matched element becomes the context for the nested `select`, and the results are collected into an array.

```json
{
    "name": "articles",
    "type": "object",
    "repeated": true,
    "query": [[".titleline"]],
    "select": [
        { "name": "title", "query": [["."]] },
        { "name": "href", "query": [["a", ["attr", "href"]]] }
    ]
}
```

Given this HTML:
```html
<ul>
    <li class="titleline"><a href="#a1">Article #1</a></li>
    <li class="titleline"><a href="#a2">Article #2</a></li>
    <li class="titleline"><a href="#a3">Article #3</a></li>
</ul>
```

Produces:
```json
{ "articles": [
    { "title": "Article #1", "href": "#a1" },
    { "title": "Article #2", "href": "#a2" },
    { "title": "Article #3", "href": "#a3" }
] }
```

> **The `.` selector** targets the **context element itself** — the element matched by the outer `query` — rather than a descendant. In the example above, `[["."]]` inside the `articles` selector is equivalent to `[[".titleline"]]`, since `.titleline` is the current context. This is the way to extract a value directly from the matched element instead of one of its children.

Because repeated `select` results accumulate, a list selector pairs naturally with pagination — wrapping it in a `repeat` that clicks through to the next page merges each page's items into one combined array.

## Dynamic Selectors

Selectors can contain dynamic formulas using `{...}` syntax, enabling runtime-computed CSS selectors:

```json
{ "click": { "query": [["{`#resultPageLinks a:contains('${_page_num}')`}"]] } }
```

See [dynamic-formulas.md](dynamic-formulas.md) for details on formula syntax and available variables.
