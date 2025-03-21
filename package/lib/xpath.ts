export interface XPathResult {
    nodes: Node[];
    value: unknown[];
}

export function evaluateXPath(xpath: string, nodes: Node[]): XPathResult {
    const result: XPathResult = {
        nodes: [],
        value: []
    };

    for (const node of nodes) {
        const eval_result = document.evaluate(xpath, node, null, XPathResult.ANY_TYPE, null);
        if (eval_result.resultType === XPathResult.STRING_TYPE) {
            result.nodes.push(node);
            result.value.push(eval_result.stringValue);
        }
        else if (eval_result.resultType === XPathResult.NUMBER_TYPE) {
            result.nodes.push(node);
            result.value.push(eval_result.numberValue);
        }
        else if (eval_result.resultType === XPathResult.BOOLEAN_TYPE) {
            result.nodes.push(node);
            result.value.push(eval_result.booleanValue);
        }
        else if (eval_result.resultType === XPathResult.UNORDERED_NODE_ITERATOR_TYPE) {
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
    }

    return result;
}
