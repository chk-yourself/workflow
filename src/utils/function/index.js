/**
 * Delays callback execution until next browser repaint
 * Best used for `scroll` and `resize` window events
 * @param {Function} callback - The function to debounce
 */

export const windowDebouncer = callback => {
  let request;

  return (...args) => {
    const context = this;

    if (request) {
      window.cancelAnimationFrame(request);
    }

    request = window.requestAnimationFrame(() => {
      callback.apply(context, args);
    });
  };
};

export const debounce = (delay, fn) => {
  let timerId;
  return (...args) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
};

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
