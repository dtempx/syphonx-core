export const args = [
    "--no-sandbox", // required to run within some containers
    "--disable-web-security", // enable accessing cross-domain iframe's
    "--disable-dev-shm-usage", // workaround for "Target closed" errors when capturing screenshots https://github.com/GoogleChrome/puppeteer/issues/1790
];
export const headers = { "Accept-Language": "en-US,en" };
export const userAgent = "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";
export const viewport = { width: 1366, height: 768 };
