# DevNotes


## Setup
```bash
sudo yarn playwright install-deps
git clone https://github.com/dtempx/syphonx-core.git
cd syphonx-core
yarn build
yarn playwright install
yarn test
```
> build stamps output with version in package.json

## Running tests
* `yarn test` to run all tests
* `yarn test --grep online/3` to run a specific test


## Deploy
```bash
yarn upgrade playwright --latest
yarn build
yarn test
git commit
git push
npm publish
```
> Publish requires authenticator code


## Useful troubleshooting commands
```bash
npx online example.json
npx online examples/1.json --url=https://www.iana.org/
npx online examples/1.json --out=log
npx offline examples/1.json examples/1.html
npx select-html --url=https://www.example.com
npx select-html --url=https://www.example.com --selector=h1
```


## Debug in browser
1. Open the developer console in any browser by hitting F12.
2. Type `syphonx=` and paste the contents of file `dist/iife/syphonx-jquery.js` into the console. This assigns the library to a variable named `syphonx`.
    > Tip: Add a `debugger` statement anywhere in the code if you need to debug the library
3. Type `template=` and paste the contents of a template file into the console. This assigns a template to a variable named `template`.
4. Type `result = await syphonx(template)` into the console to run the template.

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
```javascript
(() => {
    const script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.slim.min.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    //jQuery.noConflict();
})();
```

### Debug code running in the browser
Try https://www.builder.io/blog/debug-nodejs
