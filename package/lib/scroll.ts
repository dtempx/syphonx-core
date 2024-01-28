// waits for no scroll event to occur within a window of 200ms, or 3s maximum
export function waitForScrollEnd(): Promise<void> {
    return new Promise<void>(resolve => {
        let timer = setTimeout(() => resolve(), 3000);
        function onScroll() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                removeEventListener("scroll", onScroll);
                resolve();
            }, 200);
        }
        addEventListener("scroll", onScroll);
    });
}
