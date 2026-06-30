# Escaping in Formulas — the JSON Tax

A dynamic formula (`{…}`) lives **inside a JSON string**. JSON has its own escaping rules,
and they apply *before* the engine ever hands your expression to JavaScript. The practical
consequence is that **every backslash you want JavaScript to see must be doubled** in the
template. Get this wrong and one of two things happens: the JSON fails to parse, or — worse,
because it fails silently — your regex quietly means something different from what you
intended.

This is the single most common source of formula bugs. It applies to every place a formula
appears (`value`, `when`, `url`, `message`, dynamic selectors), not just `value`.

> For everything else about formulas, see [complex-formulas.md](complex-formulas.md) (the
> field-guide) and [dynamic-formulas.md](dynamic-formulas.md) (the hub).

---

## Why doubling is required

When the template JSON is parsed, `\\` becomes a single `\`. So to get a JavaScript `\n`
(newline metacharacter in a regex, or an escape in a string), you must write `\\n` in the
template — JSON collapses it to `\n`, which is then what the expression sees.

| You want (JavaScript) | You write (in the JSON template) |
|---|---|
| `split('\n')` | `"{_address.split('\\n')[0]}"` |
| `/\d{5}/` | `"…\\d{5}…"` |
| `/\r?\n/` | `"…/\\r?\\n/…"` |
| `\b` word-boundary | `"…\\b…"` |
| `\.` literal dot | `"…\\.…"` |

A worked example — splitting a multi-line blob on newlines:

```jsonc
// JSON template            →  JavaScript the engine runs
"{value.split('\\n')}"      →  value.split('\n')
```

If you had written `"{value.split('\n')}"`, JSON parsing turns `\n` into an actual newline
character *inside the source of your expression*, and the expression is no longer what you
meant.

---

## Quotes inside a regex

A literal double-quote inside a regex (or string) within the formula must be written `\"`,
because the surrounding JSON string is itself quoted. For example, a formula that matches an
`<img src="…">` attribute writes the literal `"` characters as `\"`:

```jsonc
{ "value": "{value.replace(/src=\"([^\"]+)\"/g, '…')}" }
```

---

## The dotAll (`/…/s`) flag

By default, `.` in a regex does **not** match newline characters. When a pattern needs to
span line breaks — e.g. matching across the lines of an address block — add the `s`
(dotAll) flag so `.` crosses newlines:

```jsonc
{ "value": "{value.match(/Address:(.*?)Phone:/s)?.[1]}" }
```

---

## The JSONC comment hazard

Many real-world templates are authored as **JSONC** — JSON with `//` and `/* */` comments
and the occasional trailing comma. If you process templates with a tool that strips
comments, **do not strip naively.** A blanket `//.*` strip will corrupt formulas that
legitimately contain `//`, most notably the protocol-fixer formulas:

```jsonc
{ "value": "{value.startsWith('http://') ? `https://${value.slice(7)}` : value}" }
```

A regex that removes `//`-to-end-of-line comments would eat everything from `http` onward.
Parse with a JSONC-aware reader instead, or inspect a field's shape with `grep` rather than
a line-based comment stripper.

---

## Quick checklist

- Doubling: every `\` you want JavaScript to see is written `\\` in the template.
- Quotes: a literal `"` inside the expression is written `\"`.
- Newlines in regex: prefer `\\r?\\n`; add the `s` flag if `.` must cross lines.
- Comments: treat templates as JSONC; never strip `//` with a naive regex.

---

## Related

- [complex-formulas.md](complex-formulas.md) — the formula field-guide; many of its parse
  and encode/decode patterns depend on getting the escaping right.
- [dynamic-formulas.md](dynamic-formulas.md) — the conceptual hub and quick reference.
