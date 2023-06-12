export type JQueryResult = JQuery<any>;
export type JQueryDelegate = Record<string, (...args: unknown[]) => JQuery<HTMLElement>>;
