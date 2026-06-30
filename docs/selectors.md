# SyphonX Selector Format

A `query` is a **double-nested array**, and the two levels of nesting are not arbitrary — each level represents a distinct dimension of selection:

```
query: [   ←──────────────── outer array: a chain of fallback stages, tried in order
    ["css-selector", ["method", "arg1"], ["method2"]],   ←── one stage: a selector + its method chain
    ["another-selector", ["method"]]                     ←── a fallback stage
]
```

- The **inner array** is a single selector followed by an optional **method chain** — a CSS/jQuery/XPath selector string first, then zero or more `["method", ...args]` operations applied to its result in sequence.
- The **outer array** is a **chain of fallback stages**. SyphonX tries each stage in order and, by default, **the first stage that matches wins**.

This is the whole reason a `query` is doubly nested: the outer level lets you probe *several different places in the DOM* for the same field, while the inner level lets you *transform* whatever each place yields. The simplest query — one selector, no fallbacks — is still written `[["h1"]]` (an outer array of one stage), which is why even trivial queries carry two sets of brackets.

The two dimensions are covered separately below: [method chaining](#methods) (the inner array) and [selector chains / fallback stages](#selector-chains-multiple-fallback-stages) (the outer array).

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
| `filter` | `[["li", ["filter", "/^item/"]]]` | `$("li").filter("/^item/")` | Keep elements matching a selector or regex |
| `not` | `[["li", ["not", ".ad"]]]` | `$("li").not(".ad")` | Drop elements matching a selector or regex |
| `json` | `[["script", ["json", "{value.data}"]]]` | `$("script").json("{value.data}")` | Parse JSON, extract path |
| `text` | `[["p", ["text", "inline"]]]` | — | Direct text only, skipping child element text (see below) |
| `split` | `[["div", ["split", ","]]]` | `$("div").text().split(",")` | Split text into an array on a delimiter |
| `map` | `[["a", ["map", "{value.toUpperCase()}"]]]` | — | Transform each matched node with a formula |
| `reverse` | `[["h1", ["prevAll"], ["reverse"]]]` | — | Reverse the matched node order (e.g. restore document order after `prevAll`) |
| `size` | `[["li", ["size"]]]` | `$("li").length` | Count of matched elements |

Beyond these, ordinary **jQuery traversal methods pass straight through** — e.g. `["eq", n]`, `["first"]`, `["last"]`, `["parent"]`, `["children"]`, `["prevAll"]`, `["nextUntil", "h3"]`, `["closest", "section"]`. Anything jQuery exposes on a selection is callable as a method stage.

## Selector Chains (Multiple Fallback Stages)

The outer array of a `query` is a **selector chain** — an ordered list of fallback stages. This is one of the most important and heavily used features in SyphonX. It lets a single field **probe several different places in the DOM** for the same value, trying each in turn:

```json
{ "name": "title", "query": [["h1"], ["h2"], [".title"]] }
```

This tries each stage in order — `$("h1")`, then `$("h2")`, then `$(".title")` — and **the first stage that matches at least one element wins**; the rest are skipped.

```json
{ "name": "price", "query": [["#sale-price"], ["#retail-price"], [".price"]] }
```

Tries `$("#sale-price")`, then `$("#retail-price")`, then `$(".price")`, stopping at the first match.

### Why this matters

The real power shows up on large, heterogeneous sites. A major retailer might render the *same* logical field — a price, a product title, a spec table — with **completely different DOM** across page types, brands, departments, or generations of the site. One template can absorb all of that variation by listing each known location as a fallback stage:

```json
{
    "name": "price",
    "type": "number",
    "query": [
        ["[data-testid='product-price'] .value"],   // current platform
        [".pdp-price .sale"],                         // older product pages
        ["#priceblock_ourprice"],                     // legacy generation
        ["xpath://*[contains(@class,'price')][1]"]    // last-resort heuristic
    ]
}
```

Because each stage can be any selector — CSS, jQuery, or XPath — and can carry its own method chain, a single field definition stays resilient as a site evolves or as you point the same template at structurally different pages. Order the stages from **most specific/most trusted to most general**, so the cleanest source wins whenever it's present and the heuristics only kick in as a safety net.

### The lighter-weight alternative: the CSS comma operator

For the simple case, you don't always need separate stages. CSS's built-in **comma operator** (selector list) groups several selectors into one, so a single stage can match any of them:

```json
{ "name": "title", "query": [["h1, h2, .title"]] }
```

This is more compact, but the semantics differ in an important way:

| | Comma operator (`"h1, h2, .title"`) | Fallback stages (`[["h1"], ["h2"], [".title"]]`) |
|---|---|---|
| Match order | **Document order** — returns whichever matches first *in the page* | **Priority order** — tries `h1` first regardless of position, falls back only if absent |
| Per-stage method chains | No — one chain applies to the combined match | Yes — each stage has its own method chain |
| Best for | Interchangeable equivalents where position doesn't matter | Ranked alternatives where you want the *preferred* source to win |

Reach for the comma operator when the candidates are interchangeable and you just want "whichever exists." Reach for fallback stages when one source is genuinely preferred over another, or when each candidate needs different post-processing. The two compose freely — a stage can itself use a comma group.

### Gathering results from all stages

Set `"all": true` to run **every** stage and combine the results instead of stopping at the first match — useful when the same kind of value lives in multiple places and you want all of them:

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
