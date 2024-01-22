import { Action, ActionType, Select } from "../index.js";
import { flatten } from "./flatten.js";

export function findAction(actions: Action[], action_type: ActionType): Action[] {
    return flatten(actions)
        .map(obj => obj.action)
        .filter(action => action.hasOwnProperty(action_type));
}

export function findSelect(actions: Action[], name: string): Select[] {
    const selectActions = findAction(actions, "select").map(action => (action as { select: Select[] }).select);
    const result: Select[] = [];
    for (const action of selectActions)
        for (const select of action)
            if (select.name === name)
                result.push(select);
    return result;
}
