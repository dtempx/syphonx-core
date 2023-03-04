rm -rf dist
rm *.js
rm *.js.map
rm *.d.ts
find ./common -name "*.js" -type f -delete
find ./common -name "*.js.map" -type f -delete
find ./common -name "*.d.ts" -type f -delete
find ./test -name "*.js" -type f -delete
find ./test -name "*.js.map" -type f -delete
find ./test -name "*.d.ts" -type f -delete
