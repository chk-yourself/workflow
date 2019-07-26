/* eslint-disable func-names */
/**
 * Delays callback execution until next browser repaint
 * Best used for `scroll` and `resize` window events
 * @param {Function} callback - The function to debounce
 */

export function windowDebounce(callback) {
  let request;

  return function(...args) {
    const context = this;

    // If the function tries to fire again before the
    // next frame animation, cancel the existing request
    if (request) {
      window.cancelAnimationFrame(request);
    }

    // requestAnimationFrame() fires a callback the next time the browser does a frame animation
    request = window.requestAnimationFrame(() => {
      callback.apply(context, args);
    });
  };
}

/**
 * Returns a function that can only be executed after a certain amount of time since it was last invoked
 * @param {Function} fn - The callback function to execute
 * @param {Number} delay - Time, in milliseconds, since the last invocation, the function must wait before firing again
 */
export function debounce(fn, delay) {
  let timerId;
  return function(...args) {
    const context = this;
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(context, args);
      timerId = null;
    }, delay);
  };
}

/**
 * Returns a function that executes the first callback on its initial call
 * then the second callback on subsequent calls
 * @param {Function} first - The function executed only on its initial call
 * @param {Function} after - The function executed on subsequent calls
 */
export const firstThen = (first, after) => {
  let count = 0;
  return (...args) => {
    count++;
    if (count === 1) {
      return first.apply(this, args);
    }
    return after.apply(this, args);
  };
};

export const count = (fn, invokeBeforeExecution) => {
  let count = 0;
  return args => {
    count++;
    if (count <= invokeBeforeExecution) {
      return true;
    }
    return fn(args, count);
  };
};

// Returns memoized version of given function
export const memoize = fn => {
  const cache = {};
  return function(...args) {
    if (cache[args]) {
      return cache[args];
    }
    cache[args] = fn[args];
    return cache[args];
  };
};
