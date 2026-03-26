/**
 * Specifies the document load state to wait for before proceeding.
 * Based on Playwright's `waitUntil` option.
 *
 * - `"load"` — Waits for the `load` event, fired when all resources (stylesheets, images) have loaded.
 * - `"domcontentloaded"` — Waits for the `DOMContentLoaded` event, fired when HTML is parsed and deferred scripts have executed.
 * - `"networkidle"` — Waits until there are no network connections for at least 500ms.
 */
export type DocumentLoadState =
      "load"
    | "domcontentloaded"
    | "networkidle";
