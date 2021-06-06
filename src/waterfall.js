// From https://github.com/lumeland/denjucks/blob/master/src/waterfall.js

export default function (tasks, callback = function () {}, forceAsync) {
  const nextTick = forceAsync ? queueMicrotask : executeSync;

  if (!Array.isArray(tasks)) {
    return callback(
      new Error(
        "First argument to waterfall must be an array of functions",
      ),
    );
  }

  if (!tasks.length) {
    return callback();
  }

  function wrapIterator(iterator) {
    return function (err, ...results) {
      if (err) {
        callback(err, ...results);
        callback = () => {};
        return;
      }

      const next = iterator.next();

      if (next) {
        results.push(wrapIterator(next));
      } else {
        results.push(callback);
      }

      nextTick(() => iterator(...results));
    };
  }

  wrapIterator(makeIterator(tasks))();
}

function executeSync(fn, ...args) {
  if (typeof fn === "function") {
    fn(...args);
  }
}

function makeIterator(tasks) {
  function makeCallback(index) {
    const fn = function () {
      if (tasks.length) {
        tasks[index].apply(null, arguments);
      }
      return fn.next();
    };

    fn.next = () => (index < tasks.length - 1) ? makeCallback(index + 1) : null;

    return fn;
  }

  return makeCallback(0);
}
