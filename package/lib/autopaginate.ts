export interface AutoPaginateResult {
    from: number;
    to: number;
    pages: number;
    status: string;
}

export async function autoPaginate(item_selector: string, next_button_selector: string, maxPages = 25, timeout = 10000): Promise<AutoPaginateResult> {
    let pages = 0;
    const from = $(item_selector).length;
    if (from === 0)
        return { from: 0, to: 0, pages, status: "no items found" };

    if ($(next_button_selector).length === 0)
        return { from, to: from, pages, status: "next page button not found" };

    const allItems = [];
    let status = "ok";

    while (true && maxPages-- > 0) {
        const currentItems = getCurrentItems();
        allItems.push(...currentItems);
        
        const $next = $(next_button_selector);  // Re-query each time
        if ($next.length === 0)
            break;
        
        const itemsBeforeClick = getCurrentItems();
        //$next.trigger("click");
        $next[0].click();  // Use native click to avoid issues with jQuery's trigger
        const ok = await waitForPageLoad(itemsBeforeClick);
        if (!ok) {
            status = "timeout waiting for next page";
            break;
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

    async function waitForPageLoad(previousItems: JQuery<HTMLElement>[]): Promise<boolean> {
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
