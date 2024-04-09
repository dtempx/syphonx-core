
## Intermediate selectors
If you're doing an intermediate computation that doesn't need to appear in the final output, then it is recommended to prefix the selector with an underscore.
This causes the data to be output to a top-level context that's easier to reference in formulas where you don't need to worry about referencing with `data.` and other things.
