var test = require('tap').test;
var asyncFor = require('../');

test('it can iterate array', function (t) {
  var array = [1, 2, 3, 4];
  var totalVisits = 0;
  asyncFor(array, visit, done);

  function visit(element, index, a) {
    t.ok(a === array, 'Array is the same as the source array');
    t.equals(element, a[index], 'Visited element @' + index + ' is correct');
    totalVisits += 1;
  }

  function done(a) {
    t.ok(a === array, 'Done is called on non-empty array');
    t.equals(totalVisits, array.length, 'All elements are visited');
    t.end();
  }
});

test('it can iterate empty array', function (t) {
  var array = [];
  var totalCount = 0;
  asyncFor(array, visit, done);

  function visit(element, index, a) {
    t.fail('Cannot visit empty array');
  }

  function done(a) {
    t.ok(a === array, 'Done is called on empty array');
    t.end();
  }
});
