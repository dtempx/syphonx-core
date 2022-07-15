# SYPHONX FAQ


### How to select an attribute?
```json
{
    "$": [["a",["attr","href"]]]
}

```

### How to get a fully qualified URL when selecing the full href of an image attribute?
```json
{
    "$": [["img",["attr","src"]]],
    "format": "href"
}
```

### How to pull a substring out of a block of text?
The `extract` method can be used to match text using a regular expression.
For example, image we want to extract only a number from a block of text...
```json
{
    "$": [["div", ["extract","/([0-9]+)/"]]]
}
```
