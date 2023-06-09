import * as fs from "fs";

const file = process.argv[2];
if (!file || file === "-h" || file === "--help") {
    console.error("usage: version-stamp <file>");
    process.exit();
}

if (!fs.existsSync(file)) {
    console.error(`version-stamp: ${file} does not exist`);
    process.exit();
}

const pkg = fs.readFileSync(new URL("../package.json", import.meta.url), "utf-8");
const { version } = JSON.parse(pkg);

const input = fs.readFileSync(file, "utf-8");

const pattern = /version = "[^"]*"/;
if (!pattern.test(input)) {
    console.error(`version-stamp: version pattern not found in file`);
    process.exit();
}

const output = input.replace(pattern, `version = "${version}"`);
fs.writeFileSync(file, output, "utf-8");

console.log(`${file} stamped with version ${version}`);
