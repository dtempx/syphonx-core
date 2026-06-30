# SyphonX

**Turn any web page into clean JSON — with a template, not a script.**

You describe *what* you want by configuring selectors in a simple template. SyphonX handles all the extracting. No imperative scraping code to write, debug, or maintain. Best for when you need high speed, low cost, with rock solid precision and repeatability. Ideal for scaling out to hundreds or thousands of sites without the maintennence nighmare of maintaining a huge code base.

```json
{ "name": "title", "query": [["h1"]] }
```

That's the whole idea. Point selectors at a page, get structured data back — from live pages or HTML you've already saved.

## See it in a glance

A template says what to grab:

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

Run it against this HTML…

```html
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples.</p>
    <a href="https://www.iana.org/domains/example">More information...</a>
</div>
```

…and you get exactly the JSON you asked for:

```json
{
    "title": "Example Domain",
    "link": "https://www.iana.org/domains/example"
}
```

Notice the `link` came back as an absolute URL — SyphonX resolves `href`/`src` for you. That's the flavor of the whole library: the obvious thing usually just happens.

## Try it

```bash
npx online example.json
```

`online` fetches the page, runs your template in a real browser, and prints the JSON. Want to peek at a page before writing anything? Pull a single element straight from a URL:

```bash
npx select --url=https://www.example.com --selector=h1
```
```html
<h1>Example Domain</h1>
```

## Why a template instead of AI — or a custom scraper?

- **Deterministic.** Same page in, same JSON out, every time. No probabilistic drift.
- **Fast and cheap.** A selector engine runs in milliseconds with no per-call API bill — so it scales to thousands of pages.
- **Resilient.** A field can list fallback selectors (`[["#sale-price"], [".price"]]`) and SyphonX takes the first that matches — so one template survives markup that varies across page types or site redesigns.
- **No glass ceiling.** jQuery, regular expressions, and inline JavaScript formulas are all on tap when a selector alone isn't enough.

And when selectors genuinely aren't enough, you can still layer AI on top for just those cases.

## What makes it different under the hood

Most scraping tools drive a browser *from the outside*. SyphonX flips that: it injects its **entire engine into the page** and runs there — with direct access to the live DOM and jQuery. When it needs the outside world to act (navigate, go back, screenshot), it hands control back to the host and picks up right where it left off. It can also run fully offline against saved HTML, no browser required.

## Want to know more?

This barely scratches the surface.

- [How SyphonX Templates Work](./docs/README.md)
- [Key Features](./docs/key-features.md)
- [Why not just use AI instead?](./docs/ai.md)
