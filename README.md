# SyphonX

**Template-driven HTML to JSON extraction.** Define what you want with jQuery selectors in a declarative JSON template, get structured data back.

## Overview

SyphonX takes a JSON template with CSS/jQuery selectors and extracts structured data from any HTML — live pages or offline files. No imperative code, just a declarative template.


## Getting Started
Here's a command that shows how to fetch a single element from a live page:

```bash
npx select --url=https://www.example.com --selector=h1
```

**OUTPUT**
```
<h1>Example Domain</h1>
```

This fetches the page at the given URL and returns the raw HTML of the first element matching the CSS selector — useful for quickly checking what's on a page before writing a template.


## How it works
Here's how it works in a little more detail...

**SYPHONX TEMPLATE**
```json
{
    "url": "https://www.example.com",
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

**HTML INPUT**
```html
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples.</p>
    <a href="https://www.iana.org/domains/example">More information...</a>
</div>
```

**SYPHONX OUTPUT**
```json
{
    "title": "Example Domain",
    "link": "https://www.iana.org/domains/example"
}
```

Run the following command to produce the output described above...

```bash
npx online example.json
```

## Want to know more?
This example just scratches the surface, here's how to learn more...
- [How SyphonX Templates Work](./docs/README.md)
- [Key Features](./docs/key-features.md)
- [Why not just use AI instead?](why-not-ai.md)
