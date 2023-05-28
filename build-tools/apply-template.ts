import * as fs from "fs";

if (!process.argv[2] || process.argv[2] === "-h" || process.argv[2] === "--help") {
    console.error("usage: apply-template <template-file> <file1> <file2> ...");
    process.exit();
}

for (const file of process.argv.slice(2)) {
    if (!fs.existsSync(file)) {
        console.error(`${file} does not exist`);
        process.exit();
    }
}

const template = fs.readFileSync(process.argv[2], "utf-8");
const files = process.argv.slice(3);

let i = 0;
let j = template.indexOf("###");
while (j > 0 && files.length > 0) {
    process.stdout.write(template.slice(i, j));
    const file = files.shift()!;
    const content = fs.readFileSync(file, "utf-8");
    process.stdout.write(content);
    i = template.indexOf("###", j + 3) + 3;
    j = template.indexOf("###", i);
}
if (i > 0)
    process.stdout.write(template.slice(i));
