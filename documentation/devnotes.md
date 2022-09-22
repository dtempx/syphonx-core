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

## Debug Profiles
* **Online** debug an online capture by specifying a script and a URL (or use the URL in the script)
* **Offline** debug an offline capture by specifying a script and an HTML file
* **Run Tests** debug all tests
* **Run Selected Test** debug a specific test (highlight a test name in the editor first)

## Deploy
```
yarn upgrade puppeteer --latest
yarn build
yarn test
npm publish
```
> Publish requires authenticator code

## Add jQuery to any page
```
(() => {
    const script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.slim.min.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    //jQuery.noConflict();
})();
```
