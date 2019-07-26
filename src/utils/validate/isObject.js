export default function isObject(value) {
  return value && Object.prototype.toString.call(value) === '[object Object]';
}
