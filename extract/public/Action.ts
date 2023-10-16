import { Break } from "./Break.js";
import { Click } from "./Click.js";
import { Each } from "./Each.js";
import { Error } from "./Error.js";
import { GoBack } from "./GoBack.js";
import { Locator } from "./Locator.js";
import { Navigate } from "./Navigate.js";
import { Reload } from "./Reload.js";
import { Repeat } from "./Repeat.js";
import { Screenshot } from "./Screenshot.js";
import { Scroll } from "./Scroll.js";
import { Select } from "./Select.js";
import { Snooze } from "./Snooze.js";
import { Switch } from "./Switch.js";
import { Transform } from "./Transform.js";
import { WaitFor } from "./WaitFor.js";
import { Yield } from "./Yield.js";

export type Action =
      BreakAction
    | ClickAction
    | EachAction
    | ErrorAction
    | GoBackAction
    | LocatorAction
    | NavigateAction
    | ReloadAction
    | RepeatAction
    | ScreenshotAction
    | ScrollAction
    | SelectAction
    | SnoozeAction
    | SwitchAction
    | TransformAction
    | WaitForAction
    | YieldAction;

export type BreakAction = { break: Break };
export type ClickAction = { click: Click };
export type EachAction = { each: Each };
export type ErrorAction = { error: Error };
export type GoBackAction = { goback: GoBack };
export type LocatorAction = { locator: Locator[] };
export type NavigateAction = { navigate: Navigate };
export type ReloadAction =  { reload: Reload };
export type RepeatAction = { repeat: Repeat };
export type ScreenshotAction = { screenshot: Screenshot };
export type ScrollAction = { scroll: Scroll };
export type SelectAction = { select: Select[] };
export type SnoozeAction = { snooze: Snooze | number | [number] | [number, number] };
export type SwitchAction = { switch: Switch[] };
export type TransformAction = { transform: Transform[] };
export type WaitForAction = { waitfor: WaitFor };
export type YieldAction = { yield: Yield };
