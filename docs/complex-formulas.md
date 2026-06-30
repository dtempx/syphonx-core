# Complex Formulas

*Also known as: value expressions, `{…}` expressions, computed values.*

Any string in a SyphonX template whose **entire** content is wrapped in curly braces —
`"{ … }"` — is evaluated as a **JavaScript expression** at extraction time instead of being
treated as a literal string. This note is a field-guide to the flavors of dynamic formula
seen across real-world templates: the patterns they fall into, how state-machine iteration
is built out of them, and the conventions that keep them robust.

> This is the deep-dive companion to [dynamic-formulas.md](dynamic-formulas.md), which is
> the conceptual hub and quick reference (including the full **variables-in-scope** table).
> Several mechanics referenced here have their own focused notes:
> [value-postprocessing.md](value-postprocessing.md) (running a `value` formula after a
> `query`), [value-wrappers.md](value-wrappers.md) (the `obj.href.value` quirk on a
> repeated array), [data-context.md](data-context.md) (how `data` is rooted),
> [internal-state-variables.md](internal-state-variables.md) (the `_`-prefixed scratch
> namespace), and [escaping.md](escaping.md) (the "JSON tax" of backslashes and quotes).

## The core idea

SyphonX template fields normally hold literal values. Wrap the value in `{…}` and SyphonX
instead **evaluates it as a JavaScript expression** and uses the result:

```jsonc
{ "name": "category", "value": "News Archive" }          // literal string
{ "name": "category", "value": "{params.category}" }     // expression → evaluated
```

A few critical mechanics:

- **The braces must enclose the whole string.** `"{value} suffix"` is *not* a formula — it
  is the literal text `{value} suffix`. Only `"{ … }"` (braces first and last) evaluates.
- **It's JSON first.** The expression lives inside a JSON string, so every backslash must
  be doubled — a regex `\n` is written `\\n`, `\d` is `\\d`, etc. This is the single most
  common source of bugs; it has its own note: [escaping.md](escaping.md).
- **Template literals** use backticks *inside* the braces:
  `"{`https://x.com/${slug}`}"`. This is how most string-building formulas work.
- **Return `undefined`/`null` to drop a value.** Returning `undefined` leaves the field
  unset; useful for "normalize if present, otherwise nothing". Returning `''` emits an
  empty string — not the same thing downstream.
- **The expression is plain JavaScript** — any operator, method, ternary, regex, template
  literal, or even an inline function (`(() => { … })()`) is fair game.

For *what variables* a formula can read (`value`, `data`, `url`, `params`, `__status`, and
the `_`-prefixed scratch variables), see the variables-in-scope table in
[dynamic-formulas.md](dynamic-formulas.md).

---

## The pattern catalog

Most formulas fall into a handful of recurring shapes, organized below by intent.

### 1. Reach for the JavaScript standard library

A formula runs in a **full JavaScript environment**, so the entire built-in standard
library is available — global functions and constructors, plus every `String`, `Array`,
`Object`, `Number`, `Math`, `Date`, and `JSON` method. You rarely need a custom selector
operation when a one-line call to a built-in does the job. This is the single most
important thing to internalize: *if JavaScript can do it, the formula can do it.*

```jsonc
{ "value": "{decodeURIComponent(value)}" }                 // decode a percent-encoded string
{ "value": "{encodeURIComponent(value)}" }                 // encode for use in a URL
{ "value": "{new Date(value).toISOString()}" }             // parse + normalize a date
{ "value": "{JSON.parse(value).price}" }                   // parse an embedded JSON blob
{ "value": "{parseInt(value, 10)}" }                       // coerce to an integer
{ "value": "{Number(value).toFixed(2)}" }                  // fixed-precision number
{ "value": "{value.normalize('NFKD')}" }                   // Unicode normalization
{ "value": "{value.replace(/\\s+/g, ' ').trim()}" }        // collapse whitespace
{ "value": "{Math.max(...value.map(Number))}" }            // reduce an array to a max
{ "value": "{value.padStart(5, '0')}" }                    // zero-pad an id
```

Commonly reached-for built-ins, by job:

| Need | Built-in to reach for |
|---|---|
| URL encode/decode | `encodeURIComponent`, `decodeURIComponent`, `encodeURI`, `URL` |
| Parse/serialize JSON | `JSON.parse`, `JSON.stringify` |
| Dates | `new Date(...)`, `.toISOString()`, `Date.parse` |
| Numbers | `Number`, `parseInt`, `parseFloat`, `.toFixed`, `Math.*` |
| Strings | `.trim`, `.toUpperCase`/`.toLowerCase`, `.replace`, `.slice`, `.split`, `.padStart`, `.normalize`, `.match` |
| Arrays | `.map`, `.filter`, `.find`, `.slice`, `.join`, `.includes`, `Array.from`, spread `[...x]` |

Many of the more specific patterns below (date normalization, encode/decode, regex parsing,
array reshaping) are really just this pattern applied to a particular built-in — they are
broken out separately because the *intent* recurs, not because they use a different
mechanism.

### 2. Default / coalesce / passthrough

The simplest formulas substitute a fallback or pass a value straight through.

```jsonc
{ "value": "{value || 'General'}" }              // default when the query came back empty
{ "value": "{params.image_url}" }                // reflect a column captured in an earlier stage
{ "value": "{params.index}" }                    // the list ordinal passed into a detail run
{ "value": "{_city_us || _city_uk}" }            // coalesce two scratch variables
```

### 3. Conditional / branch (ternary chains)

Pick an output by inspecting the value, the URL, or a sibling. Ternaries chain to form a
mini switch.

```jsonc
// classify by which URL the item came from
{ "value": "{url.includes('/events') ? 'Events' : url.includes('/news') ? 'News' : url.includes('/publications') ? 'Publications' : ''}" }

// branch on a query-string flag
{ "value": "{url.includes('?type=client') ? 'Client Types' : 'Services'}" }

// map a heading to a code, else strip a suffix
{ "value": "{value.includes('Court Admissions') ? 'court' : value.includes('Bar Admissions') ? 'state' : value.replace(' Admissions','')}" }

// collapse several scratch flags into one label
{ "value": "{_leader ? 'Leader' : _coleader ? 'Co-Leader' : _member ? 'Member' : null}" }

// override using a sibling field (note: 'state' must be selected BEFORE this field)
{ "value": "{/^[A-Z]{2}$/.test(data.state) ? 'United States' : value}" }
```

### 4. Normalize / clean a scalar

Trim, re-case, reformat dates, fix protocols.

```jsonc
{ "value": "{value && value.trim()}" }                                   // trim, guarding undefined
{ "value": "{url.split('/')[3]?.toUpperCase()}" }                        // derive a code from a URL segment
{ "value": "{value ? new Date(value).toISOString() : undefined}" }       // normalize a date, drop if absent
{ "value": "{value.startsWith('http://') ? `https://${value.slice(7)}` : value}" }  // force https
```

The `… : undefined` tail is idiomatic: normalize when a value exists, otherwise leave the
field unset rather than emitting an empty/invalid value.

### 5. Build a string with a template literal

Backticks inside the braces compose URLs and keys from other fields.

```jsonc
// synthesize a stable key from the page URL + a sibling field
{ "value": "{`${url}#${data.name.replace(/[^A-Za-z]+/g, '_')}`}" }

// derive a full-size image URL from a thumbnail
{ "value": "{`${data.image_url?.replace('_thumb', '')}`}" }

// build the next worklist URL from a popped code (see "State-machine iteration" below)
{ "value": "{`https://example.com/${_codes.shift()}/index`}" }
```

### 6. Regex extract / parse

Pull structured pieces out of a free-text blob with `.match(…)`, guarded by optional
chaining so a miss yields `undefined` instead of throwing. A common case is splitting a
multi-line address block into discrete fields:

```jsonc
{ "name": "address1", "value": "{_address.split('\\n')[0]}" },
{ "name": "address2", "value": "{_address.split('\\n').length > 2 ? _address.split('\\n')[1] : null}" },
{ "name": "city",     "value": "{_address.split('\\n').slice(-1)[0].match(/([A-Z][^,]+)/)?.[1]}" },
{ "name": "state",    "value": "{_address.split('\\n').slice(-1)[0].match(/, ([A-Z]{2}) /)?.[1]}" },
{ "name": "zipcode",  "value": "{_address.split('\\n').slice(-1)[0].match(/([0-9]{5}$|[A-Z0-9]{4} [A-Z0-9]{3}$)/)?.[1]}" }
```

Note `?.[1]` — `String.match` returns `null` on no match, and `?.` keeps that from
throwing, propagating `undefined` to the field instead.

### 7. Encode / decode

Repair URL-encoded or wrapper-mangled values.

```jsonc
// decode a percent-encoded value (guard non-strings)
{ "value": "{typeof value === 'string' ? decodeURIComponent(value) : value}" }

// rewrite an image-proxy <img src> back to the real URL
{ "value": "{typeof value === 'string' ? value.replace(/src=\"\\/_next\\/image\\/\\?url=([^\"&]+)[^\"]*\"/g, (_, u) => `src=\"${decodeURIComponent(u)}\"`) : value}" }
```

The `typeof value === 'string' ? … : value` guard is the safe idiom whenever a method would
throw on a non-string (e.g. when the field is occasionally an array or absent).

### 8. Array post-processing (the `value.…` on a repeated select)

When a formula sits on a **repeated** select (`"repeated": true`), `value` is the whole
captured **array**. If the rows are captured objects (a nested `select`), each element's
fields are still in the engine's wrapper form — so a captured `href` is read as
`obj.href.value`, **not** `obj.href`. This trips people up constantly and has its own note:
[value-wrappers.md](value-wrappers.md).

**Dedupe / filter rows** — the most common array formula:

```jsonc
// drop a bare landing/index link
{ "value": "{value.filter(obj => !obj.href.value.endsWith('/people/'))}" }

// dedupe against another already-captured list by href
{ "value": "{value.filter(obj => !data.professionals.map(({ href }) => href).includes(obj.href.value))}" }
```

(Note the second line reads `obj.href.value` from the wrapped `value` but `href` from the
unwrapped `data` — see [value-wrappers.md](value-wrappers.md) for why.)

**Map / transform each row** — even consulting the rest of the array to decide a label:

```jsonc
{ "value": "{value.map(x => ({...x, role: x.role.value.includes('Lead') ? value.filter(y => y.role.value.includes('Lead')).length <= 1 ? 'Leader' : 'Co-Leader' : 'Team Member' }))}" }
```

**Synthesize the array** — sometimes the scraped rows only matter as a count, and the real
values are manufactured, or an entry the page omits is appended:

```jsonc
// replace each card with a synthetic numbered URL
{ "value": "{value.map((v, i) => ({href: `https://example.com/locations/${i + 1}`}))}" }

// append a second entry the page leaves out
{ "value": "{[...value, {href: 'https://example.com/locations/secondary'}]}" }
```

**Pick one element by param** — scrape every card on one page, then a detail run selects the
right one by its reflected `index`:

```jsonc
{ "value": "{value[(params?.index || 1) - 1]}" }
```

### 9. Inline function (IIFE) for multi-step logic

When a single expression gets unwieldy, wrap an immediately-invoked function so you can use
statements, locals, and loops. For example, building an HTML `<p>` + `<ul>` from a
multi-line blob:

```jsonc
{ "value": "{(() => { const raw = Array.isArray(value) ? value.filter(Boolean).join('\\n') : (value || ''); const lines = raw.split(/\\r?\\n/).map(s => s.trim()).filter(Boolean); if (!lines.length) return ''; const p = lines[0]; const lis = lines.slice(1); const ul = lis.length ? '<ul>' + lis.map(x => `<li>${x}</li>`).join('') + '</ul>' : ''; return `<p>${p}</p>` + ul; })()}" }
```

Both the arrow form `(() => { … })()` and the classic form `(function(v){ … })(value)`
work.

---

## Formulas outside `value`

`{…}` works in many fields, not just `value`.

### `when` — conditional guards

`when` decides whether an action/field/error runs. The formula returns a boolean.

```jsonc
{ "when": "{__status === 404}" }                 // skip dead pages (HTTP status — see below)
{ "when": "{_not_found}" }                        // branch on a captured flag
{ "when": "{!_next}" }                            // stop paging when the worklist is empty
{ "when": "{params.full_refresh === true}" }      // branch on an input param
{ "when": "{data.length < 100}" }                 // completeness check on a list (see error below)
{ "break": { "when": "{_page_num >= _page_count}" } }  // loop exit
```

### `url` — computed navigation targets

The `navigate`/`click` `url` can be a formula, typically draining a worklist of pages:

```jsonc
{ "navigate": { "url": "{_next}" } }              // go to the next queued URL
{ "url": "{_links.shift()}" }                     // pop the next link off a scratch array
```

### `message` — dynamic error/log text

`error` blocks interpolate the actual count into the message. This `message`/`when` pair is
the standard **completeness check** that nearly every list template ends with — a guardrail
that fails the run when too few items were captured:

```jsonc
{ "error": {
    "message": "{`${data.length} people found, 200 or more expected`}",
    "code": "incomplete",
    "when": "{data.length < 200}"
} }
```

### `limit` — computed loop bounds

```jsonc
{ "limit": "{_page_count + 3}" }
```

### Dynamic selectors — formulas *inside* a query

A query string that is itself `{…}` (usually a template literal) builds the CSS selector at
runtime. This is how loop counters and computed tab indices get into selectors:

```jsonc
// click the pager link for the next page number
{ "click": { "query": [["{`#resultPageLinks a:contains('${_page_num}')`}"]] } }

// target the tab panel whose index is found by name
{ "query": [["{`.tabs__content[data-tab='${_tabs.indexOf('People')+1}'] …`}"]] }
```

A lighter-weight form is a formula inside a query **operation argument** rather than the
selector itself — e.g. `["eq","{_n}"]` picks the `_n`-th matched element:

```jsonc
{ "query": [[".location-address", ["eq", "{_n}"], ["cut", "\n", 0]]] }
```

---

## State-machine iteration with `select` + `repeat`

A worklist/pager is built by combining scratch arrays, `repeat`, mutating formulas, and
`break`. Internal state variables (`_`-prefixed) are the right tool here because they
survive across actions and loop iterations — see
[internal-state-variables.md](internal-state-variables.md). The recurring shapes:

**Drain a queue with `.shift()`** — seed a scratch array, then pop one item per pass until
it is empty:

```jsonc
{ "select": [{ "name": "_codes", "repeated": true, "value": ["ja","de","es"] }] },
{ "repeat": { "actions": [
    { "break":  { "when": "{_codes.length === 0}" } },
    { "select": [{ "name": "_next", "value": "{`https://example.com/${_codes.shift()}/index`}" }] },
    { "navigate": { "url": "{_next}" } },
    { "select": [ /* …capture this page's rows… */ ] }
] } }
```

`.shift()` **mutates** the scratch array each pass — pop a work item, act on it, repeat
until the array is empty. Calling `.shift()` more than once per iteration silently skips
items, so do it exactly once.

**Increment a counter** — manage an explicit `_page_num` and break when it reaches a known
count:

```jsonc
{ "break":  { "when": "{_page_num >= _page_count}" } },
{ "select": [{ "name": "_page_num", "value": "{_page_num + 1}" }] },
{ "click":  { "query": [["{`#resultPageLinks a:contains('${_page_num}')`}"]] } }
```

There is no built-in page counter — you maintain your own internal variable (such as
`_page_num`) and stamp it onto each row if you want it in the output:

```jsonc
{ "name": "page", "type": "number", "value": "{_page_num}" }
```

---

## Gotchas & conventions

- **`value` is post-query, pre-formula.** If a field has no `query`, `value` is `undefined`
  — guard with `value && …` or `typeof value === 'string' ? … : value`. (See
  [value-postprocessing.md](value-postprocessing.md).)
- **Array elements expose `.value`.** Inside a repeated *object* select's formula, read a
  captured sub-field as `obj.href.value`, not `obj.href`. (See
  [value-wrappers.md](value-wrappers.md).)
- **Field order matters when referencing `data.<sibling>`.** `data` only contains fields
  selected *before* the current one within the same action. If a formula reads
  `data.state`, the `state` field must be selected first. (See
  [data-context.md](data-context.md).)
- **Return `undefined`/`null` to omit**, return `''` to emit an empty string — they are not
  the same downstream.
- **Optional chaining is your friend** for parse formulas: `…match(…)?.[1]`,
  `params?.index`, `data.image_url?.replace(…)` all avoid throwing on a miss.
- **`__status` has two underscores**; ordinary scratch variables have one. Don't confuse
  the HTTP status with a state variable.
- **`.shift()` mutates** — each `repeat` pass consumes from the array. Call it once per
  iteration.
- **Doubling backslashes is mandatory** — the formula is a JSON string. See
  [escaping.md](escaping.md).

---

## Related

- [dynamic-formulas.md](dynamic-formulas.md) — conceptual hub and quick reference, including
  the full variables-in-scope table (`value`, `data`, `url`, `params`, `__status`, `_*`).
- [escaping.md](escaping.md) — the "JSON tax": backslash doubling, quotes in regex, dotAll,
  and the JSONC comment hazard.
- [value-postprocessing.md](value-postprocessing.md) — running a `value` formula after a
  `query`.
- [value-wrappers.md](value-wrappers.md) — the `obj.field.value` quirk in repeated-array
  post-processing.
- [data-context.md](data-context.md) — how the `data` root is resolved and what is visible
  when.
- [internal-state-variables.md](internal-state-variables.md) — the `_`-prefixed scratch
  namespace used heavily by the iteration patterns above.
