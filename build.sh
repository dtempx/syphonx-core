npx tsc -p tsconfig.esm.json
npx tsc -p tsconfig.commonjs.json
npx rollup index.js --format umd --name syphonx --file ./dist/umd/syphonx.js
