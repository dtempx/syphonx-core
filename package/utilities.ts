import {
    Action,
    ActionType,
    EachAction,
    RepeatAction,
    Select,
    SelectQuery,
    SwitchAction,
    Transform
} from "./public/index.js";

export interface FlatAction {
    action: Action;
    level: number;
    case?: number;
}

/**
 * Finds all actions of the specified type within a nested action tree.
 * Flattens the tree first, then filters by the given action type key.
 * @param actions The top-level actions array to search.
 * @param action_type The action type key to filter by (e.g. `"select"`, `"click"`).
 * @returns An array of matching {@link Action} objects.
 */
export function findAction(actions: Action[], action_type: ActionType): Action[] {
    return flattenTemplateActions(actions)
        .map(obj => obj.action)
        .filter(action => action.hasOwnProperty(action_type));
}

/**
 * Returns the last select group in the action tree, or `undefined` if none exist.
 * Useful for identifying the final set of select fields that produce the template's output.
 * @param actions The top-level actions array to search.
 * @returns The {@link Select} array from the last select action, or `undefined`.
 */
export function findLastSelectGroup(actions: Action[]): Select[] | undefined {
    const selectActions = findAction(actions, "select").map(action => (action as { select: Select[] }).select);
    return selectActions.at(-1);
}

/**
 * Finds all {@link Select} entries with the given name across every select action in the tree.
 * @param actions The top-level actions array to search.
 * @param name The select field name to match.
 * @returns An array of matching {@link Select} objects (may be empty).
 */
export function findSelect(actions: Action[], name: string): Select[] {
    const group = findAction(actions, "select").map(action => (action as { select: Select[] }).select);
    const result: Select[] = [];
    for (const action of group)
        for (const select of action)
            if (select.name === name)
                result.push(select);
    return result;
}

/**
 * Recursively flattens a nested action tree into a linear array of {@link FlatAction} objects.
 * Descends into `each`, `repeat`, and `switch` actions, tracking the nesting `level`
 * and the 1-based `case` index for switch branches.
 * @param actions The actions array to flatten.
 * @param result Accumulator array (used internally for recursion).
 * @param level Current nesting depth (0 = top-level).
 * @param n The 1-based switch case index, if inside a switch branch.
 * @returns A flat array of all actions with their nesting metadata.
 */
export function flattenTemplateActions(actions: Action[], result: FlatAction[] = [], level = 0, n?: number): FlatAction[] {
    for (const action of actions) {
        result.push(!n ? { action, level } : { action, level, case: n });
        if (action.hasOwnProperty("each"))
            flattenTemplateActions((action as EachAction).each.actions, result, level + 1);
        else if (action.hasOwnProperty("repeat"))
            flattenTemplateActions((action as RepeatAction).repeat.actions, result, level + 1);
        else if (action.hasOwnProperty("switch"))
            for (const obj of (action as SwitchAction).switch)
                flattenTemplateActions(obj.actions, result, level + 1, (action as SwitchAction).switch.indexOf(obj) + 1);
    }
    return result;
}

/**
 * Collapses multiple select actions to a single select action.
 * @param actions The action tree to collapse.
 * @param names Optionally, only collapse the specified names.
 * @returns Returns the collapsed select actions.
 */
export function flattenTemplateSelect(actions: Action[], names?: string[]): Select[] {
    const group = findAction(actions, "select").map(action => (action as { select: Select[] }).select);
    const result: Select[] = [];
    for (const action of group)
        for (const select of action)
            if (!names || (select.name && names.includes(select.name))) {
                const existing_select = result.find(obj => obj.name === select.name);
                if (!existing_select)
                    result.push(select);
                else if (existing_select.query || select.query)
                    existing_select.query = mergeQueries(existing_select.query, select.query);
            }
    return result;
}

/**
 * Collects all {@link Transform} entries from every transform action in the tree
 * into a single flat array.
 * @param actions The top-level actions array to search.
 * @returns A flat array of all transform steps across the action tree.
 */
export function flattenTemplateTransforms(actions: Action[]): Transform[] {
    return findAction(actions, "transform").map(action => (action as { transform: Transform[] }).transform).flat();
}

function mergeQueries(q1: SelectQuery[] | undefined, q2: SelectQuery[] | undefined): SelectQuery[] | undefined {
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
        return undefined;
}
