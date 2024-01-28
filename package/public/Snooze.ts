import { When } from "./When.js";

export type SnoozeMode = "before" | "after" | "before-and-after"; // default=before
export type SnoozeInterval = [number, number] | [number, number, SnoozeMode]; //seconds

export interface Snooze {
    name?: string;
    interval: [number] | [number, number];
    when?: When;
}
