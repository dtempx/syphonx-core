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

Multiple selector chains can be provided as fallbacks — the first one that matches wins:

```json
{ "name": "price", "query": [["#sale-price"], ["#retail-price"], [".price"]] }
```

See [selectors.md](selectors.md) for the full selector reference including all methods, XPath support, and multi-selector behavior. For a dedicated XPath guide, see [xpath.md](xpath.md).

## Dynamic Formulas

String values in templates can contain JavaScript expressions wrapped in `{...}`, evaluated at runtime:

```json
{ "name": "lastmod", "query": [[".date"]], "value": "{value ? new Date(value).toISOString() : undefined}" }
```

Formulas have access to `value` (the extracted result), `data` (accumulated output), `url`, `params`, and internal state variables prefixed with `_`. They can be used in selectors, `when` conditions, `value` post-processing, and more:

```json
{ "break": { "when": "{_page_num >= _page_count}" } }
```

See [dynamic-formulas.md](dynamic-formulas.md) for the full reference.

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

## Other Actions

Beyond [**`select`**](api/interfaces/Select.md), templates support:

- [**`click`**](api/interfaces/Click.md) — Click elements (for dynamic content, pagination)
- [**`transform`**](api/interfaces/Transform.md) — Modify the DOM before selecting (remove elements, replace text)
- [**`navigate`**](api/interfaces/Navigate.md) — Go to another URL
- [**`each`**](api/interfaces/Each.md) — Loop over elements, running nested actions per element
- [**`when`**](api/interfaces/When.md) — Conditional execution
- [**`repeat`**](api/interfaces/Repeat.md) — Loop with break conditions
- [**`scroll`**](api/interfaces/Scroll.md) — Scroll the page
- [**`keypress`**](api/interfaces/Keypress.md) — Simulate keyboard input

## More Info
- [API Reference](api/README.md)
- [Timeout Behavior](timeout.md)
