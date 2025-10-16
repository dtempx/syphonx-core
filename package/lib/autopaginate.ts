
import { sleep } from "./sleep.js";

export interface AutoPaginateOptions {
    item_selector: string; // selector for items to be collected
    next_button_selector: string; // selector for the "next page" button
    max_pages?: number; // maximum number of pages to paginate through
    min_click_delay?: number; // minimum delay between clicks (milliseconds)
    max_click_delay?: number; // maximum delay between clicks (milliseconds)
    timeout?: number; // timeout waiting for next page to load (milliseconds)
}

export interface AutoPaginateResult {
    from: number; // the original number of items before pagination
    to: number; // the final number of items after pagination
    pages: number; // the number of pages that were paginated through
    status: string; // "ok", "no items found", "next page button not found", "timeout waiting for next page"
}

export async function autoPaginate({ item_selector, next_button_selector, max_pages = 25, min_click_delay = 1000, max_click_delay, timeout = 30000 }: AutoPaginateOptions): Promise<AutoPaginateResult> {
    let pages = 0;
    const from = $(item_selector).length;
    if (from === 0)
        return { from: 0, to: 0, pages, status: "no items found" };

    if ($(next_button_selector).length === 0)
        return { from, to: from, pages, status: "next page button not found" };

    if (max_click_delay === undefined)
        max_click_delay = min_click_delay;
    else if (max_click_delay < min_click_delay)
        max_click_delay = min_click_delay;

    const allItems = [];
    let status = "ok";

    while (status === "ok" && max_pages-- > 0) {
        const currentItems = getCurrentItems();
        allItems.push(...currentItems);
        
        let $next = $(next_button_selector);  // Re-query each time
        if ($next.length === 0)
            break;
        
        const itemsBeforeClick = getCurrentItems();

        const t0 = Date.now();
        while (Date.now() - t0 < timeout) {
            $next[0].scrollIntoView({ block: "center", behavior: "smooth" });
            await sleep(500);
            $next[0].focus();
            await sleep(100);
            //$next.trigger("click");
            $next[0].click();  // use native click to avoid issues with jQuery's trigger
            const ok = await waitForPageLoad(itemsBeforeClick, 1000);
            if (ok) {
                status = "ok";
                const interval = Math.random() * (max_click_delay - min_click_delay) + min_click_delay;
                await sleep(interval); // pause briefly after acquiring a page
                break;
            }
            else {
                status = "timeout waiting for next page";
                $next = $(next_button_selector);  // re-acquire next button
                if ($next.length === 0) {
                    status += ", next page button not found";
                    break;
                }
            }
        }

        pages += 1;
    }
    
    const $container = $(item_selector).parent();
    $(item_selector).remove();
    allItems.forEach(item => $container.append(item));
    return { from, to: allItems.length, pages, status };

    function getCurrentItems(): JQuery<HTMLElement>[] {
        return $(item_selector).toArray().map(element => $(element));  // Re-query each time
    }

    function itemsAreEqual(items1: JQuery<HTMLElement>[], items2: JQuery<HTMLElement>[]) {
        if (items1.length !== items2.length)
            return false;
        for (let i = 0; i < items1.length; i++)
            if (!items1[i].is(items2[i]))
                return false;
        return true;
    }

    async function waitForPageLoad(previousItems: JQuery<HTMLElement>[], timeout = 1000): Promise<boolean> {
        const t0 = Date.now();
        return new Promise<boolean>(resolve => {
            const checkForNewContent = () => {
                const currentItems = getCurrentItems();
                if (currentItems.length > 0 && !itemsAreEqual(currentItems, previousItems))
                    resolve(true);
                else if (Date.now() - t0 > timeout)
                    resolve(false);
                else
                    setTimeout(checkForNewContent, 100);
            };
            checkForNewContent();
        });
    }
}
