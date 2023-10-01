import * as fs from "fs";

export const script = fs.readFileSync(new URL("../dist/iife/syphonx-jquery.min.js", import.meta.url), "utf8");
