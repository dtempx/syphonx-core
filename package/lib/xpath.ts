export function evaluateXpath(xpath: string, node: Node): { nodes: Node[], value: unknown } {
    const eval_result = document.evaluate(xpath, node, null, XPathResult.ANY_TYPE, null);
    if (eval_result.resultType === XPathResult.STRING_TYPE) {
        return { nodes: [node], value: eval_result.stringValue };
    }
    else if (eval_result.resultType === XPathResult.NUMBER_TYPE) {
        return { nodes: [node], value: eval_result.numberValue };
    }
    else if (eval_result.resultType === XPathResult.BOOLEAN_TYPE) {
        return { nodes: [node], value: eval_result.booleanValue };
    }
    else if (eval_result.resultType === XPathResult.UNORDERED_NODE_ITERATOR_TYPE) {
        const result = {
            nodes: [] as Node[],
            value: [] as unknown[]
        };
        let node = eval_result.iterateNext();
        while (node) {
            result.nodes.push(node);
            result.value.push(node.textContent);
            node = eval_result.iterateNext();
        }
        return result;
    }
    else if (eval_result.resultType === XPathResult.ORDERED_NODE_ITERATOR_TYPE) {                
        const result = {
            nodes: [] as Node[],
            value: [] as unknown[]
        };
        let node = eval_result.iterateNext();
        while (node) {
            result.nodes.push(node);
            result.value.push(node.textContent || null);
            node = eval_result.iterateNext();
        }
        return result;
    }
    else {
        return { nodes: [], value: null };
    }
}
