/**
 * Performs deep comparison two objects or arrays to determine if they are equivalent
 * @param {Array|Object} value - The value to compare
 * @param {Array|Object} other - The other value to compare
 */

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
    Object.keys(value).forEach(key => {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    });
  }
  return true;
};
