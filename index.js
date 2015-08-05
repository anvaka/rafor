module.exports = asyncFor;

/**
 * Iterates over array in async manner. This function attempts to maximize
 * number of elements visited within single event loop cycle, while at the
 * same time tries to not exceed a time threshold allowed to stay within
 * event loop.
 *
 * @param {Array} array which needs to be iterated. Array-like objects are OK too.
 * @param {VisitCalback} visitCallback called for every element within for loop.
 * @param {DoneCallback} doneCallback called when iterator has reached end of array.
 * @param {Object=} options - additional configuration:
 * @param {number} [options.step=1] - default iteration step
 * @param {number} [options.maxTimeMS=8] - maximum time (in milliseconds) which
 *   iterator should spend within single event loop.
 * @param {number} [options.probeElements=5000] - how many elements should iterator
 *   visit to measure its iteration speed.
 */
function asyncFor(array, visitCallback, doneCallback, options) {
  var start = 0;
  var elapsed = 0;
  options = options || {};
  var step = options.step || 1;
  var maxTimeMS = options.maxTimeMS || 8;
  var pointsPerLoopCycle = options.probeElements || 5000;
  // we should never block main thread for too long...
  setTimeout(processSubset, 0);

  function processSubset() {
    var finish = Math.min(array.length, start + pointsPerLoopCycle);
    var i = start;
    var timeStart = new Date();
    for (i = start; i < finish; i += step) {
      visitCallback(array[i], i, array);
    }
    if (i < array.length) {
      elapsed += (new Date() - timeStart);
      start = i;

      pointsPerLoopCycle = Math.round(start * maxTimeMS/elapsed);
      setTimeout(processSubset, 0);
    } else {
      doneCallback(array);
    }
  }
}
