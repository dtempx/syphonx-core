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
            } else {
                const parts = key.split(".");
                const objectType = parts.slice(0, -1).join(".");
                const method = parts[parts.length - 1];

                let obj = contentWindow;
                for (const part of objectType.split('.')) {
                    obj = obj[part];
                }

                if (obj) {
                    const descriptor = Object.getOwnPropertyDescriptor(obj, method);
                    if (descriptor) {
                        let targetObj = window as Record<string, any>;
                        for (const part of objectType.split('.')) {
                            targetObj = targetObj[part];
                        }
                        Object.defineProperty(targetObj, method, descriptor);
                    }
                }
            }
        }
    }
    document.body.removeChild(iframe);
}
