// Entry point for mocha tests
import * as fs from "fs";
(global as unknown as { script: string }).script = fs.readFileSync(new URL("./dist/iife/syphonx-jquery.min.js", import.meta.url), "utf8");
