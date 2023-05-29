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

export function scrollToBottom(delay = 100, max = 100): Promise<number> {
    let n = 0;
    return new Promise(resolve => {
        const timer = setInterval(() => {
            window.scrollBy(0, window.innerHeight);
            n += 1;
            if ((window.scrollY >= document.body.scrollHeight - window.innerHeight) || (--max < 1)) {
                clearInterval(timer);
                resolve(n);
            }
        }, delay);
    });
}
