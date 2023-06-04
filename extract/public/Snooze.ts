export type Snooze = [number, number];
export type SnoozeMode = "before" | "after" | "before-and-after"; // default=before
export type SnoozeInterval = [number, number] | [number, number, SnoozeMode]; //seconds
