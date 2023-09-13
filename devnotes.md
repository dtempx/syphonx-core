# DevNotes


## Setup
```
git clone https://github.com/dtempx/syphonx-core.git
cd syphonx-core
yarn build
yarn test
```


## Run
* `node online examples/1.json` extract data from a live online page using a script
* `node offline examples/1.json examples/1.html` extract data from an offline HTML file
* `node online examples/1.json --out=log` view the log (for troubleshooting)
* `node online examples/1.json --out=data,log` view the extract data and the log


## Running tests
* `yarn test` to run all tests
* `yarn test --grep online/3` to run a specific test


## Deploy
```
yarn upgrade playwright --latest
yarn build
yarn test
npm publish
```
> Publish requires authenticator code


## Debug in browser
1. Open the developer console in any browser by hitting F12
2. Type `syphonx=` and paste the contents of file `dist/iife/syphonx-jquery.js` into the console, this assigns the library to a function named `syphonx`
    > Tip: Add a `debugger` statement anywhere in the code if you need to debug the library
3. Type `template=` and paste the contents of a template file into the console, this assigns a template to a variable named `template`
4. Type `result = await syphonx(template)` into the console to run the template

To see additional diagnostic output, run the following and then run `result = await syphonx({ ...template, debug: true })`
```javascript
window.addEventListener("message", event => {
    if (event.source === window && event.data.direction === "syphonx")
        console.log("SYPHONX", event.data.message);
});
```

## VSCode Debug Profiles
* **Run File** debug the active source file in the editor
* **Online** debug an online capture by specifying a script and a URL (or use the URL in the script)
* **Offline** debug an offline capture by specifying a script and an HTML file
* **Run Tests** debug all tests
* **Run Selected Test** debug a specific test (highlight a test name in the editor first)



## Alternate debugging techniques

### Add jQuery to the browser
```
(() => {
    const script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.slim.min.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    //jQuery.noConflict();
})();
```

### Debug code running in the browser
Try https://www.builder.io/blog/debug-nodejs


## Notes
```
execute
  each action
    dispatch(action)
        select
        break
        click
        repeat
        snooze
        transform
        waitfor
        yield

select
    select.active
        select.when
            select.pivot -> selectResolvePivot (creates a context, uses keypath)
            select.union -> selectResolveUnion (does not create a context, uses keypath)
            select.$ -> selectResolveSelector (creates parent/child contexts, uses keypath)
            select.value -> selectResolveValue (no context, no keypath)

selectResolveSelector(select, item, context)
    query(select, context)
        if select.type !== "object" -> merge
        if select.type === "object" -> select(select.select -> subcontext) -> merge

query(select, context)  ...context passthru only
    resolveQuery(context)
        mergeQueryResult

resolveQuery(..., context)
    case selector
        when "." -> context.nodes
        when ".." -> context.parent.nodes
        when "{window}" -> $(window)
        when "{document}" -> $(document)
        else -> evaluate(selector), resolveQueryNodes(context.nodes)
    resolveQueryOps()  (no context)

resolveQueryOps
    case operator
        when "blank" ->
        when "cut" ->
        when "extract" ->
        when "filter" ->
        when "html" ->
        when "map" ->
        when "nonblank" ->
        when "replace" ->
        when "replaceHTML" ->
        when "replaceText" ->
        when "replaceWith" ->
        when "scrollBottom" ->
        when "size" ->
        when "split" ->
        when "text" ->
        else -> dispatch to jquery

selectResolveSelector
    query
        resolveQuery
            formatResult
            resolveQueryOps
                formatResult
```