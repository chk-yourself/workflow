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
    } else {
      return after.apply(this, args);
    }
  }
};

export const count = (fn, invokeBeforeExecution) => {
  let count = 0;
  return (args) => {
    count++;
    if (count <= invokeBeforeExecution) {
      return true;
    } else {
      return fn(args, count);
    }
  };
};
