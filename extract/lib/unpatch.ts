export function unpatch(keys: string[]): void {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    if (iframe.contentWindow) {
        const contentWindow = iframe.contentWindow as Record<string, any>;
        for (const key of keys) {
            if (!key.includes(".")) {
                const obj = contentWindow[key];
                if (obj) {
                    const descriptor = Object.getOwnPropertyDescriptor(contentWindow, key);
                    if (descriptor)
                        Object.defineProperty(window, key, descriptor);
                }    
            }
            else {
                const [objectType, method] = key.split(".");
                const obj = contentWindow[objectType];
                if (obj) {
                    const descriptor = Object.getOwnPropertyDescriptor(obj, method);
                    if (descriptor)
                        Object.defineProperty((window as Record<string, any>)[objectType], method, descriptor);
                }    
            }
        }
    }
    document.body.removeChild(iframe);
}
