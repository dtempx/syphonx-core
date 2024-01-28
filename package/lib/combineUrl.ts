export function combineUrl(base: string, relative: string): string {
    if (!relative)
        return base;
    if (!base)
        return relative;  
    return new URL(relative, base).toString();
}
