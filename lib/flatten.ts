import { Action, EachAction, RepeatAction, SwitchAction } from "../index.js";

export interface FlatAction {
    action: Action;
    level: number;
    case?: number;
}

export function flatten(actions: Action[], result: FlatAction[] = [], level = 0, n?: number): FlatAction[] {
    for (const action of actions) {
        result.push(!n ? { action, level } : { action, level, case: n });
        if (action.hasOwnProperty("each"))
            flatten((action as EachAction).each.actions, result, level + 1);
        else if (action.hasOwnProperty("repeat"))
            flatten((action as RepeatAction).repeat.actions, result, level + 1);
        else if (action.hasOwnProperty("switch"))
            for (const obj of (action as SwitchAction).switch)
                flatten(obj.actions, result, level + 1, (action as SwitchAction).switch.indexOf(obj) + 1);
    }
    return result;
}
