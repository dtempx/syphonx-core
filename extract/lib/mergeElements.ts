export function mergeElements(source: JQuery<HTMLElement>, target: JQuery<HTMLElement>): void {
    for (const targetAttr of Array.from(target[0].attributes)) {
        const sourceAttr = Array.from(source[0].attributes).find(attr => attr.name === targetAttr.name);
        if (sourceAttr && targetAttr.name === "class") {
            const value = Array.from(new Set([
                ...sourceAttr.value.split(" "),
                ...targetAttr.value.split(" ")
            ])).join(" ");
            source.attr("class", value);
        }
        else if (!sourceAttr) {
            source.attr(targetAttr.name, targetAttr.value);
        }
    }
}
