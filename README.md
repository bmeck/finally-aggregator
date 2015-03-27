# Finally Aggregator

A simple utility for aggregating cleanup functions for async programming problems.

```
var FinallyAggregator = require('finally-aggregator');
var cleaner = new FinallyAggregator();
```

## Example problem and solution

```
inParallel(
  [
    createTmpFile,
    performActionThatErrors
  ],
  function (err) {
    // how do I tell createTempFile to cleanup!?
  }
);
```

```
function createTmpFile(cleaner, next) {
  /// ...
  cleaner.add(cleanupTmpFile);
  next();
}
inParallel(
  [
    createTmpFile.bind(null, cleaner),
    performActionThatErrors.bind(null, cleaner)
  ],
  function (err) {
    if (err) cleaner.finish();
  }
);
```

## What it does

1. The `FinallyAggregator` will queue up functions by using `.add(fn)`.
2. Once `.finish()` is called all queued functions will execute.
3. If `.add(fn)` is called after `.finish()` it will execute immediately.

This lets us queue up cleanup if we have not reached a point where cleanup is desired, or perform cleanup if we have passed the point where cleanup is called for.
