npx tsc

# IIFE BUILD
npx rollup extract/index.js --format iife --name syphonx --file dist/iife/syphonx.js
node build-tools/version-stamp dist/iife/syphonx.js
npx terser dist/iife/syphonx.js --compress ecma=2022 --mange --output dist/iife/syphonx.min.js

# JQUERY BUILD
node build-tools/apply-template \
    build-tools/templates/syphonx-jquery.txt \
    node_modules/jquery/dist/jquery.slim.js \
    dist/iife/syphonx.js \
    > dist/iife/syphonx-jquery.js

# JQUERY BUILD MINIFIED
node build-tools/apply-template \
    build-tools/templates/syphonx-jquery.txt \
    node_modules/jquery/dist/jquery.slim.min.js \
    dist/iife/syphonx.min.js \
    > dist/iife/syphonx-jquery.min.js

# ESM BUILD
npx tsc -p tsconfig.esm.json
rm -rf dist/esm/extract/private # purge empty declaration files that only contained interface definitions
rm dist/esm/extract/public/*.js*
rm dist/esm/template.js*
echo '{"type":"module"}' > dist/esm/package.json
node build-tools/version-stamp dist/esm/extract/context.js
node build-tools/embed-script dist/esm/execute.js dist/iife/syphonx-jquery.min.js -o dist/esm/execute.js

# COMMONJS BUILD
npx tsc -p tsconfig.cjs.json
rm -rf dist/cjs/extract/private # purge empty declaration files that only contained interface definitions
rm dist/cjs/extract/public/*.js*
rm dist/cjs/template.js*
echo '{"type":"commonjs"}' > dist/cjs/package.json
node build-tools/version-stamp dist/cjs/extract/context.js
node build-tools/embed-script dist/cjs/execute.js dist/iife/syphonx-jquery.min.js -o dist/cjs/execute.js

# UMD BUILD
npx rollup extract/index.js --format umd --name syphonx --file dist/umd/syphonx.js
node build-tools/version-stamp dist/umd/syphonx.js
