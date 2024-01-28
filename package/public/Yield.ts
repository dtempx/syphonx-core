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
    locators?: YieldLocator[];
    navigate?: YieldNavigate;
    reload?: {};
    screenshot?: YieldScreenshot;
}

export interface YieldLocator {
    name: string;
    selector: string;
    method: LocatorMethod;
    params?: unknown[];
    frame?: string;
}

export interface YieldNavigate {
    url: string;
}

export interface YieldScreenshot {
    [key: string]: unknown;
    name?: string;
    selector?: string;
    fullPage?: boolean;
}

export interface YieldState {
    step: number[];
    params?: YieldParams;
    level?: number;
    result?: unknown;
}
