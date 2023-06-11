import * as fs from "fs";

if (process.argv[2] === "-h" || process.argv[2] === "--help" || !(process.argv.length === 4 || (process.argv.length === 6 && process.argv[4] === "-o"))) {
    console.error("usage: embed-script <target-file> <source-file> [-o <output-file>]");
    process.exit();
}

for (const file of process.argv.slice(2, 4)) {
    if (!fs.existsSync(file)) {
        console.error(`embed-script: ${file} does not exist`);
        process.exit();
    }
}

const source = fs.readFileSync(process.argv[3], "utf-8");
const target = fs.readFileSync(process.argv[2], "utf-8");
const sourceFile = process.argv[3];
const outputFile = process.argv[4] === "-o" ? process.argv[5] : undefined;

const i = target.indexOf(`script = "";`);
if (i === -1) {
    console.error("embed-script: target pattern not found");
    process.exit();
}

const embed = source
    .replace(/\\/g, `\\\\`) // escape backslashes
    .replace(/"/g, `\\"`) // escape double-quotes
    .replace(/\r?\n/g, `\\n`); // escape newlines
const j = target.indexOf(`"`, i) + 1;

if (outputFile) {
    fs.writeFileSync(outputFile, `${target.slice(0, j)}${embed}${target.slice(j)}`);
    console.log(`${outputFile} embedded ${sourceFile}`);
}
else {
    process.stdout.write(target.slice(0, j));
    process.stdout.write(embed);
    process.stdout.write(target.slice(j));
}
