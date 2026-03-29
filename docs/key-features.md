## Key Features

- **Zero dependencies** — runs in-browser or offline against raw HTML
- **jQuery + Regex + JavaScript** — no glass ceiling on what you can select or transform (if it works in jQuery it works in SyphonX)
- **Works anywhere** — inject into Playwright, Puppeteer, browser console, or use standalone
- **Offline extraction** — process stored HTML files without a browser
- **Dynamic content** — click, scroll, wait for elements, handle pagination
- **Inside-out execution** — unlike most scraping tools that control a browser remotely from an external process ("outside-in"), SyphonX injects its entire extraction engine *into* the page context and runs there. This gives it direct access to the live DOM, jQuery, and the page's JavaScript environment. When the engine needs the host to perform an external action (navigate, go back, take a screenshot), it **yields** control back to the host (e.g. Playwright), which performs the action and re-enters the engine. This yield/re-enter cycle is how inside-out execution cooperates with the outside world — while still supporting traditional outside-in execution as well.
