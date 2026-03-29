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

## XPath Selectors

XPath selectors are supported using the `{xpath}` prefix:

```json
{ "name": "title", "query": [["{xpath}//h1"]] }
```

## Dynamic Selectors

Selectors can contain dynamic formulas using `{...}` syntax, enabling runtime-computed CSS selectors:

```json
{ "click": { "query": [["{`#resultPageLinks a:contains('${_page_num}')`}"]] } }
```

See [dynamic-formulas.md](dynamic-formulas.md) for details on formula syntax and available variables.
