npx tsc

# ESM BUILD
npx tsc -p tsconfig.esm.json
echo '{"type":"module"}' > dist/esm/package.json
node build-tools/version-stamp dist/esm/extract/context.js

# COMMONJS BUILD
npx tsc -p tsconfig.cjs.json
echo '{"type":"commonjs"}' > dist/cjs/package.json
node build-tools/version-stamp dist/cjs/extract/context.js

# UMD BUILD
npx rollup extract/index.js --format umd --name syphonx --file dist/umd/syphonx.js
node build-tools/version-stamp dist/umd/syphonx.js

# IIFE BUILD
npx rollup extract/index.js --format iife --name syphonx --file dist/iife/syphonx.js
node build-tools/version-stamp dist/iife/syphonx.js

# JQUERY BUILD
node build-tools/apply-template \
    build-tools/templates/syphonx-jquery.txt \
    node_modules/jquery/dist/jquery.slim.min.js \
    dist/iife/syphonx.js \
    > dist/iife/syphonx-jquery.js
