# SyphonX

**Template-driven HTML to JSON extraction.** Define what you want with jQuery selectors in a declarative JSON template, get structured data back.

## Overview

SyphonX takes a JSON template with CSS/jQuery selectors and extracts structured data from any HTML — live pages or offline files. No imperative code, just a declarative template.


## Getting Started
Here's a command that shows how to fetch a single element from a live page:

```bash
node tools/select-html --url=https://www.example.com --selector=h1
```

**OUTPUT**
```
<h1>Example Domain</h1>
```

This fetches the page at the given URL and returns the raw HTML of the first element matching the CSS selector — useful for quickly checking what's on a page before writing a template.


## How it works
Here's how it works in a little more detail...

**INPUT HTML**
```html
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples.</p>
    <a href="https://www.iana.org/domains/example">More information...</a>
</div>
```

**SYPHONX TEMPLATE**
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

**SYPHONX OUTPUT**
```json
{
    "title": "Example Domain",
    "link": "https://www.iana.org/domains/example"
}
```

Run the following command to produce the output described above:

```bash
node tools/online examples/1.json
```


This example just scratches the surface. Here's what SyphonX can do:

- **Flexible selectors** — chain CSS, jQuery, and XPath with built-in methods like `attr`, `extract` (regex capture), `replace`, `cut`, `json`, and more; define fallback selectors that try alternatives in order ([selector reference](./docs/selectors.md))
- **Dynamic formulas** — embed JavaScript expressions directly in your JSON template to compute selectors at runtime, transform values, branch conditionally, or drive pagination loops ([formula reference](./docs/dynamic-formulas.md))
- **Rich action set** — beyond `select`: `click`, `navigate`, `scroll`, `keypress`, `each` (loop over elements), `repeat` (loop with break conditions), `transform` (reshape the DOM before selecting), and `switch`/`when` for conditional branching
- **Nested objects and arrays** — extract structured objects with nested `select` blocks, collect repeated items into arrays, or gather results across multiple selectors with `all: true`
- **Dynamic content** — click buttons, wait for elements to appear, paginate through multi-page results, all driven by the same declarative template
- **Works anywhere** — inject into Playwright or Puppeteer, run from a browser console, or process offline HTML files with zero production dependencies ([key features](./docs/key-features.md))

## Want to know more?
- [How SyphonX Templates Work](./docs/overview.md)
- [Key Features](./docs/key-features.md)

## Why not just use AI?

AI-based extraction is powerful, but it has real tradeoffs for structured data collection at scale:

- **Cost** — LLM calls are expensive. Running thousands of extractions quickly adds up.
- **Speed** — AI inference is slow compared to a selector-based engine.
- **Reliability** — AI output is probabilistic. You may get slightly different results between runs, which can be a real problem if you need results that are highly deterministic.

SyphonX gives you deterministic, fast, cheap extraction — and you can always layer AI on top for the cases where selectors alone aren't enough.
