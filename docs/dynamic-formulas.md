# SyphonX Dynamic Formulas

SyphonX supports dynamic formulas — JavaScript expressions embedded inside JSON string values, wrapped in curly braces `{...}`. These formulas are evaluated at runtime and have access to contextual variables such as `value`, `data`, `url`, `params`, and internal state variables (prefixed with `_`).

This document provides a conceptual overview of the different ways dynamic formulas are used. For an in-depth field-guide — the full pattern catalog, state-machine iteration, and gotchas — see [complex-formulas.md](complex-formulas.md). For the escaping rules that apply to every formula, see [escaping.md](escaping.md).

**Related references:**
> - **Complex formulas** — the deep-dive field-guide: the by-intent pattern catalog (using the JavaScript standard library, coalesce, branch, normalize, parse, encode/decode, array ops, IIFE), worklist/pager state machines, and conventions. See [complex-formulas.md](complex-formulas.md).
> - **Escaping (the "JSON tax")** — formulas live inside JSON strings, so every backslash must be doubled (`\\n`, `\\d`); literal quotes are `\"`. See [escaping.md](escaping.md).
> - **Internal state variables** (names prefixed with `_`, e.g. `_page_num`, `_h1`, `_ok`) appear throughout the examples below. They are kept out of the final output and are always projected at the top level of every formula's scope. See [internal-state-variables.md](internal-state-variables.md).
> - **The `data` context** — how the `data` variable is rooted at the top-level output and what is visible to a formula when. See [data-context.md](data-context.md).
> - **Value post-processing** — when a field has both a `query` and a `value`, the query runs first and the `value` formula post-processes its result (available as `value`). See [value-postprocessing.md](value-postprocessing.md).
> - **Wrapped values in array post-processing** — on a `repeated` object select, `value` is the raw captured array whose row fields carry a `.value` sub-field (read `obj.href.value`, not `obj.href`), while `data` is unwrapped. See [value-wrappers.md](value-wrappers.md).

---

## Variables in scope

A formula can read a handful of implicit variables. Which ones are meaningful depends on
*where* the formula sits.

| Variable | Meaning | Example |
|---|---|---|
| `value` | The value the field's `query` just produced (before the formula). `undefined` if there is no `query`. See [value-postprocessing.md](value-postprocessing.md). | `{value.trim()}` |
| `data` | The accumulated output object so far, rooted at the top level. Within a repeated/object select, sibling fields are visible too. At the top level of a list template `data` is the captured **array** (so `data.length`). See [data-context.md](data-context.md). | `{data.state}`, `{data.length < 100}` |
| `params` | Parameters passed into the template — chiefly columns reflected from an earlier list stage into a later detail run. | `{params.category}`, `{params.index}` |
| `url` | The URL of the page currently loaded. | `{url.endsWith('#2')}` |
| `__status` | The HTTP status of the current page (**two** leading underscores). Set by the host after navigation. | `{__status === 404}` |
| `_name` | Any **internal state variable** — a field whose `name` starts with a single `_`. Scratch values, not emitted to output, projected flat at the top level of every formula. See [internal-state-variables.md](internal-state-variables.md). | `{_city_us \|\| _city_uk}` |

> **Note on `__status` vs `_name`.** `__status` (double underscore) is the built-in HTTP
> status, distinct from your own single-underscore scratch variables. There is **no**
> built-in page/iteration counter — if you need one, maintain your own internal variable
> (e.g. `_page_num`) across a `repeat` loop. See
> [complex-formulas.md](complex-formulas.md#state-machine-iteration-with-select--repeat).

---

## 1. Dynamic CSS Selectors in Queries

Dynamic formulas can be used inside `"query"` selectors to construct CSS selectors at runtime using template literals. This is useful when the target element depends on a value discovered earlier in the extraction, such as a tab index or a page number.

```json
{
    "name": "description",
    "type": "string",
    "all": true,
    "query": [["{`[data-tab='${_tabs.indexOf('Services')+1}'] .widget-container > *`}", ["html", "inner"]]]
}
```

Here `_tabs` is a variable captured earlier that contains an array of tab labels. The formula computes the correct tab index and builds the selector dynamically.

Another common use is constructing a click target for pagination:

```json
{ "click": { "query": [["{`#resultPageLinks a:contains('${_page_num}')`}"]] } }
```

---

## 2. Conditional Execution

The `"when"` property accepts a formula that controls whether an action runs. This enables conditional branching based on HTTP status, boolean flags, or data state.

**Checking HTTP status:**

```json
{
    "error": {
        "when": "{__status === 404}",
        "message": "Page not found",
        "code": "page-not-found",
        "level": 0,
        "stop": true
    }
}
```

**Branching on a boolean flag:**

```json
{
    "name": "status",
    "type": "string",
    "union": [
        { "when": "{!_not_found}", "value": "ok" },
        { "when": "{_not_found}", "value": "not-found" }
    ]
}
```

**Breaking out of a loop:**

```json
{ "break": { "when": "{_page_num >= _page_count}" } }
```

---

## 3. Data Count Validation

Formulas are used in `"error"` blocks to assert that a minimum number of results were extracted, providing early warning when a site changes or extraction fails silently.

```json
{
    "error": {
        "message": "{`${data.length} people found, 200 or more expected`}",
        "code": "incomplete",
        "level": 1,
        "when": "{data.length < 200}"
    }
}
```

---

## 4. Date Conversion

Raw date strings extracted from a page can be normalized to ISO format inline.

```json
{
    "name": "lastmod",
    "query": [[".sectionDate"]],
    "value": "{value ? new Date(value).toISOString() : undefined}"
}
```

---

## 5. Pagination Control

Formulas manage page counters and loop state during multi-page extraction.

```json
{ "break": { "when": "{_page_num >= _page_count}" } },
{ "select": [{ "name": "_page_num", "value": "{_page_num + 1}" }] },
{ "click": { "query": [["{`#resultPageLinks a:contains('${_page_num}')`}"]] } }
```

Here `_page_num` is incremented each iteration, compared against `_page_count` to decide when to stop, and interpolated into the click selector to advance to the next page.

---

## 6. Referencing Parameters

In multi-stage extractions, values captured in an earlier stage can be accessed via `params` in a later stage.

```json
{
    "name": "category",
    "type": "string",
    "value": "{params.category}"
}
```

---

## 7. Value Transformation

Formulas on the `"value"` property can clean, reshape, or reformat extracted data. The variable `value` refers to the raw extracted result. When a field defines both a `query` and a `value`, the query runs first and the formula post-processes its result — see [value-postprocessing.md](value-postprocessing.md) for a full treatment.

**Trimming whitespace:**

```json
{ "value": "{value && value.trim()}" }
```

**Fixing protocol:**

```json
{ "value": "{value.startsWith('http://') ? `https://${value.slice(7)}` : value}" }
```

**Filtering duplicates from an array:**

```json
{ "value": "{value.filter(obj => !data.professionals.map(({ href }) => href).includes(obj.href.value))}" }
```

Note the mix of `href` (from the unwrapped `data`) and `obj.href.value` (from the wrapped `value` of a repeated select) — see [value-wrappers.md](value-wrappers.md) for why these differ.

**Reformatting HTML structure:**

```json
{
    "query": [
        "ul:contains('•')",
        ["replaceWith", "{'<ul>' + value.replace(/(• )/gm,'\\n').trim().split('\\n').filter(text => text.length>0).map(text => `<li>${text}</li>`).join('') + '</ul>'}"]
    ]
}
```

---

## 8. URL-Derived Values

The current page URL is available as `url`, enabling extraction of metadata directly from the address.

```json
{ "value": "{url.split('/')[3]?.toUpperCase()}" }
```

```json
{ "value": "{url.includes('/newsroom-events') ? 'Events' : url.includes('/newsroom-news') ? 'News' : 'Publications'}" }
```

---

## 9. Array and Collection Manipulation

Formulas can append to arrays, reshape objects, or generate synthetic entries.

**Appending an entry:**

```json
{ "value": "{[...value, {href: 'https://example.com/locations/secondary'}]}" }
```

**Mapping with index:**

```json
{ "value": "{value.map((v, i) => ({href: `https://example.com/locations/${i + 1}`}))}" }
```

---

## 10. Complex Inline Logic (IIFEs)

For cases that require multiple statements, an immediately-invoked function expression can be used.

```json
{
    "value": "{(() => { const d = value.split('|')[0].trim(); const dateObj = new Date(d); return isNaN(dateObj) ? null : dateObj.toISOString(); })()}"
}
```
