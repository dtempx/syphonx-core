import { When } from "./When.js";

export interface Locator {
    name: string; // name of the intermediate property for the host to feed forward into next syphonx extract iteration via state.vars
    frame?: string; // the selector to pass to page.frameLocator()
    selector: string; // the selector to pass to page.locator()
    method?: LocatorMethod; // name of a playwright locator method such as "getAttribute", "allTextContents", etc. (see https://playwright.dev/docs/api/class-locator)
    params?: unknown[]; // method parameters for the locator method
    promote?: boolean; // directs the host to promote the shadow root from the element out into the top level DOM
    chain?: boolean; // chains a locator to the previous locator, default is false
    when?: When;
}

export type LocatorMethod = string; // https://playwright.dev/docs/api/class-locator
