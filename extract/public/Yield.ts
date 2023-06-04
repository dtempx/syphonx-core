import { DocumentLoadState } from "./DocumentLoadState.js";
import { LocatorMethod} from "./Locator.js";
import { When } from "./When.js";

export interface Yield {
    name?: string;
    params?: YieldParams;
    when?: When;
}

export interface YieldParams extends Record<string, unknown> {
    timeout?: number;
    waitUntil?: DocumentLoadState;
    click?: {};
    goback?: {};
    locator?: YieldLocator;
    navigate?: YieldNavigate;
    reload?: {};
    screenshot?: YieldScreenshot;
}

export interface YieldLocator {
    frame?: string;
    selector: string;
    method: LocatorMethod;
    params: unknown[];
}

export interface YieldNavigate {
    url: string;
}

export interface YieldScreenshot {
    selector?: string;
}

export interface YieldState {
    step: number[];
    params?: YieldParams;
    level?: number;
    result?: unknown;
}
