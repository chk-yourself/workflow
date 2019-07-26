/**
 * Performs deep comparison two objects or arrays to determine if they are equivalent
 * @param {Array|Object} value - The value to compare
 * @param {Array|Object} other - The other value to compare
 */

export default function isEqual(value, other) {
  const type = Object.prototype.toString.call(value);

  // If both objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;
  const OBJECT = '[object Object]';
  const ARRAY = '[object Array]';
  const FUNCTION = '[object Function]';
  // If items are neither objects nor arrays, return false
  if (type !== OBJECT && type !== ARRAY) return false;

  // Compare length of two items
  const valueLen = type === ARRAY ? value.length : Object.keys(value).length;
  const otherLen = type === ARRAY ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  const compare = (item1, item2) => {
    const itemType = Object.prototype.toString.call(item1);
    if (itemType !== Object.prototype.toString.call(item2)) return false;
    if (itemType === OBJECT || itemType === ARRAY) {
      return isEqual(item1, item2);
    }
    if (itemType === FUNCTION) {
      return item1.toString() === item2.toString();
    }
    return item1 === item2;
  };

  if (type === ARRAY) {
    for (let i = 0; i < valueLen; i++) {
      if (!compare(value[i], other[i])) return false;
    }
  } else {
    const props = Object.keys(value);
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (value.hasOwnProperty(prop) && !compare(value[prop], other[prop])) {
        return false;
      }
    }
  }
  return true;
}
