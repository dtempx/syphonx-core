// CommonJS entry point
import * as fs from "fs";
import { setScript } from "./execute.js";

export * from "./index.js";

setScript(fs.readFileSync(new URL("./dist/iife/syphonx-jquery.js", __dirname), "utf8"));
