npx tsc
npx tsc -p tsconfig.esm.json
echo '{"type":"module"}' > dist/esm/package.json
npx tsc -p tsconfig.cjs.json
echo '{"type":"commonjs"}' > dist/cjs/package.json
npx rollup index.js --format umd --name syphonx --file dist/umd/syphonx.js
npx rollup index.js --format iife --name syphonx --file dist/iife/syphonx.js
node build-tools/version-stamp dist/iife/syphonx.js
node build-tools/apply-template \
    build-tools/templates/syphonx-jquery.txt \
    node_modules/jquery/dist/jquery.slim.min.js \
    dist/iife/syphonx.js \
    > dist/iife/syphonx-jquery.js
