# rafor [![Build Status](https://travis-ci.org/anvaka/rafor.svg)](https://travis-ci.org/anvaka/rafor)

This project will allow you to iterate over huge arrays asynchronously without
impacting responsiveness of the application.

# usage

``` js
// Let's say you have a huge array, and you want to find its maximum
// element. Once element is found you want to report it back to requestor:
var asyncFor = require('rafor');

function findMaxElement(array, cb) {
  var max = Number.NEGATIVE_INFINITY;

  asyncFor(array, visit, done);

  function visit(el, index, array) {
    if (el > max) max = el;
  }

  function done(array) {
    cb(max);
  }
}
```

The code above will attempt to limit its time spent within `visit()` function
to `8 ms`. This will ensure that your main JavaScript thread is not 100% busy
calculating maximum, and the browser still has time to do other operations.

Unlike many other `async for` implementations, this iterator will attempt to
maximize number of elements visited within single event loop cycle, while still
limiting itself to a given time quota.

## Configuration

If you want to change time quota of `8 ms` to something different, you can
pass it as an optional argument:

``` js
asyncFor(array, visit, done, {
  maxTimeMS: 5 // spend no more than 5 milliseconds on `visit()`
});
```

By default the iterator will visit every single element of your source array.
If you want to change iteration step you can also pass it via configuration:

``` js
asyncFor(array, visit, done, {
  step: 3 // Visit element 0, 3, 6, 9, 12, ... and so on
});
```

Finally, iterator takes its opportunity to measure speed of your `visit()`
callback during the first event loop cycle. By default it assumes that visiting
10,000 elements should be fast enough to not impact responsiveness of the
browser, but if this number is too high or too low for your case, please give
iterator a hint:

``` js
// Let's say our `visit()` is CPU intensive function, and we assume that
// calling visit() five times will require 10 to 16 milliseconds (which
// gives good FPS rate and responsiveess). We can tell the iterator, that
// it can meause first five calls:
asyncFor(array, visit, done, {
  probeElements: 5
});

// The iterator will keep remeasuring performance of `visit()` callback on
// every event loop cycle, and will adjust number of calls to `visit()`
// based on collected data.
```

# install

With [npm](https://npmjs.org) do:

```
npm install rafor
```

# license

MIT
