import { Action, Select, SelectQuery } from "../index.js";
import { findAction } from "./find.js";

/**
 * Collapses multiple select actions to a single select action.
 * @param actions The action tree to collapse.
 * @param selectors Optionally, only collapse the specified selectors.
 * @returns Returns the collapsed select actions.
 */
export function collapse(actions: Action[], selectors?: string[]): Select[] {
    const selectActions = findAction(actions, "select").map(action => (action as { select: Select[] }).select);
    const result: Select[] = [];
    for (const action of selectActions)
        for (const select of action)
            if (!selectors || (select.name && selectors.includes(select.name))) {
                const existing_select = result.find(obj => obj.name === select.name);
                if (!existing_select)
                    result.push(select);
                else
                    existing_select.query = mergeQueries(existing_select.query, select.query);
            }
    return result;
}

function mergeQueries(q1: SelectQuery[] | undefined, q2: SelectQuery[] | undefined): SelectQuery[] {
    if (q1 && q2) {
        const jsons = q1.map(obj => JSON.stringify(obj));
        const a = q2.filter(obj => jsons.find(json => json === JSON.stringify(obj)));
        q1.push(...a);
        return q1;
    }
    else if (q1 && !q2)
        return q1;
    else if (!q1 && q2)
        return q2;
    else
        return [];
}
