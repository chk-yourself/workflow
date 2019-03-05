
/**
 * Checks if two arrays or objects are equal
 * @param {Array|Object} value
 * @param {Array|Object} other
 */

// eslint-disable-next-line import/prefer-default-export
export const isEqual = (value, other) => {
  const type = Object.prototype.toString.call(value);

  // If both objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  const typeObj = '[object Object]';
  const typeArr = '[object Array]';
  // If items are neither objects nor arrays, return false
  if (type !== typeObj && type !== typeArr) return false;

  // Compare length of two items
  const valueLen = type === typeArr ? value.length : Object.keys(value).length;
  const otherLen = type === typeArr ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  const compare = (item1, item2) => {
    const typeFunc = '[object Function]';
    const itemType = Object.prototype.toString.call(item1);
    if (itemType !== Object.prototype.toString.call(item2)) return false;
    if (itemType === typeObj || itemType === typeArr) {
      return isEqual(item1, item2);
    }
    if (itemType === typeFunc) {
      return item1.toString() === item2.toString();
    }
    return item1 === item2;
  };

  if (type === typeArr) {
    for (let i = 0; i < valueLen; i++) {
      if (!compare(value[i], other[i])) return false;
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }
  return true;
};

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