# XPath Selectors

SyphonX supports XPath selectors alongside CSS/jQuery selectors. XPath is useful when CSS selectors are insufficient — for example, selecting elements by text content, navigating upward in the DOM, or using XPath functions to compute values.

> **Note:** XPath selectors require an online (browser) context. They rely on `document.evaluate()`, which is only available in a live browser environment. Using an XPath selector in offline mode will produce an `eval-error`.

## Syntax

There are two supported prefix forms:

| Prefix | Example | Notes |
|--------|---------|-------|
| `/` or `//` | `"//h1"` | Standard XPath path starting with `/` |
| `xpath:` | `"xpath:string(/html/head/title)"` | Required for XPath functions that don't start with `/` |

Both forms are case-insensitive for the `xpath:` prefix.

## Element Selection

Select elements using standard XPath path expressions. The text content of matched elements is returned, just like CSS selectors:

```json
{ "name": "heading", "query": [["//h1"]] }
```

```json
{ "name": "title", "query": [["xpath://title"]] }
```

## Attribute Selection

Append `/@attribute-name` to select an attribute value directly:

```json
{ "name": "href", "query": [["//a/@href"]] }
```

Method chains work with XPath selectors too, so you can also use the `attr` method:

```json
{ "name": "href", "query": [["//a", ["attr", "href"]]] }
```

## Repeated Results

Set `"repeated": true` to collect all matching nodes:

```json
{ "name": "meta_content", "query": [["//meta/@content"]], "repeated": true }
```

## XPath Functions

Use the `xpath:` prefix to call XPath functions that return strings, numbers, or booleans:

```json
{ "name": "title_text", "query": [["xpath:string(/html/head/title)"]] }
```

```json
{ "name": "meta_count", "query": [["xpath:count(//meta)"]] }
```

```json
{ "name": "has_paragraphs", "query": [["xpath:boolean(//p)"]] }
```

The return type is inferred from the XPath expression:
- `string(...)` → string
- `count(...)` → number
- `boolean(...)` or comparisons like `count(...) > 0` → boolean

## Mixing XPath and CSS Selectors

XPath and CSS selectors can appear in the same `query` array as fallback stages — the engine tries each in order and uses the first that returns a result:

```json
{ "name": "title", "query": [["h1"], ["//h1"]] }
```

## Chaining Methods

All standard query methods (`extract`, `replace`, `cut`, `attr`, etc.) work after an XPath selector:

```json
{
    "name": "domain",
    "query": [["//a/@href", ["extract", "/^https://([^/]+)/"]]]
}
```

## Full Example

```json
{
    "url": "https://example.com",
    "actions": [{
        "select": [
            { "name": "title",          "query": [["//title"]] },
            { "name": "heading",        "query": [["//h1"]] },
            { "name": "link",           "query": [["//a/@href"]] },
            { "name": "meta_values",    "query": [["//meta/@content"]], "repeated": true },
            { "name": "title_text",     "query": [["xpath:string(/html/head/title)"]] },
            { "name": "meta_count",     "query": [["xpath:count(//meta)"]] },
            { "name": "has_paragraphs", "query": [["xpath:count(//p) > 0"]] }
        ]
    }]
}
```

## Limitations

- XPath selectors only work **online** (browser context). Offline mode does not support XPath.
- XPath uses `document.evaluate()` — the standard browser XPath 1.0 API. XPath 2.0 and 3.0 features are not available.
- Namespace-aware XPath (e.g. for XML documents with prefixes) is not currently supported.
