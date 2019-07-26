export default function isFunction(value) {
  return value && {}.toString.call(value) === '[object Function]';
}
