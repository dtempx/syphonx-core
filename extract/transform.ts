import { Controller } from "./controller.js";
import { Transform } from "./public/index.js";

export interface TransformOptions {
    url?: string;
    vars?: Record<string, unknown>;
    debug?: boolean;
    root?: unknown;
}

export function transform(transforms: Transform[], options: TransformOptions = {}): void {
    const controller = new Controller(options);
    controller.transform(transforms);
}
