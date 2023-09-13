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
echo '{"type":"module"}' > dist/esm/package.json
node build-tools/version-stamp dist/esm/extract/controller.js
node build-tools/embed-script dist/esm/host.js dist/iife/syphonx-jquery.min.js -o dist/esm/host.js

# COMMONJS BUILD
npx tsc -p tsconfig.cjs.json
echo '{"type":"commonjs"}' > dist/cjs/package.json
node build-tools/version-stamp dist/cjs/extract/controller.js
node build-tools/embed-script dist/cjs/host.js dist/iife/syphonx-jquery.min.js -o dist/cjs/host.js

# UMD BUILD
npx rollup extract/index.js --format umd --name syphonx --file dist/umd/syphonx.js
node build-tools/version-stamp dist/umd/syphonx.js
