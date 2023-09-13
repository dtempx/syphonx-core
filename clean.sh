rm -rf dist
rm -rf docs
find . -name "*.js" ! -path "./node_modules/*" -type f -exec rm {} +
find . -name "*.js.map" ! -path "./node_modules/*" -type f -exec rm {} +
find . -name "*.d.ts" ! -path "./node_modules/*" -type f -exec rm {} +
