# SyphonX Task List version 1.2.81

## Documentation
- [x] Document xpath selector support in docs/xpath.md and link to overview.md
- [x] Generate docs/features.md--a comprehensive list of features by reviewing all the interfaces and types in the docs/api folder
- [ ] Add a discussion of alternative solutions like scrapy, apify, parsehub, portia, octoparse in alternative.md, include a feature comparision table
- [x] Document overall timeout behavior
- [x] Document how to select inline text within an element `"query": [[".",["text","inline"]]]`
- [ ] Update schema.json to make sure its aligned with the implementation

## Behavior Fixes
- [x] add scroll option to click action
- [x] make format=href default when attr=href or attr=src
- [ ] break action at root level doesn't end because it just returns and doesn't execute the last instructions in displatch
- [ ] navigate action evaluates selector twice which causes problems if using a formula to shift a list of urls
- [ ] format=href doesn't work with value defined selectors
- [ ] replace action accepts a simple string search and replace (in addition to a regex)
- [ ] always yield after a click, so we generally don't need to worry about yielding at all
- [ ] when returning a null or undefined value from a select with repeated=true, [null] is always returned where just null is expected

## New Features
- [ ] analyze action that yields out to the host and runs an AI prompt
    - works like a select action that takes input from data so far and outputs a text or JSON result
    - expose the following properites on the action: prompt, type, repeated
    - use the standard OpenAI API
    - host reads api_key, base_url, model from a config.json file
- [ ] implement nextPage behavior
    - see commented out test in online/7
    - rename autopaginate transform to nextPageAll
- [ ] support dot format for selector names
    - example `"name": "foo.bar"` outputs JSON data like `{"foo": { "bar": {...} } }`