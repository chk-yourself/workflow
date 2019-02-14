/* eslint-disable func-names */
import { isEqual } from '../utils';

const arr1 = [0, 1, 2, 3];
const arr2 = [0, 1, 2, 3];
const arr3 = [0, 1, 2, 2];
const arr4 = [0, [7, ['hello', true, false, null]]];
const arr5 = [0, [7, ['hello', true, false, null]]];
const arr6 = [0, [7, ['hello', true, true, null]]];

const obj1 = {
  a: 0,
  b: 1,
  c: 2
};

const obj2 = {
  a: 0,
  b: 1,
  c: 2
};

const obj3 = {
  a: 0,
  b: 1,
  c: 1
};

const obj4 = {
  a: 0,
  b: ['a', 'b', 'c'],
  c: {
    d: 'hello',
    e: 7,
    f: true
  }
};

const obj5 = {
  a: 0,
  b: ['a', 'b', 'c'],
  c: {
    d: 'hello',
    e: 7,
    f: true
  }
};

const obj6 = {
  a: 0,
  b: ['a', 'b', 'c'],
  c: {
    d: 'hello',
    e: 7,
    f: false
  }
};

describe('isEqual suite', function() {
  test('Should return false if items are not the same type', function() {
    expect(isEqual(arr1, obj1)).toBe(false);
  });

  test('Should return true if items are arrays containing identical ordered list of primitive values', function() {
    expect(isEqual(arr1, arr2)).toBe(true);
  });

  test('Should return false if items are arrays containing different values', function() {
    expect(isEqual(arr1, arr3)).toBe(false);
  });

  test('Should return true if items are arrays containing identical ordered list of primitive values and nested arrays', function() {
    expect(isEqual(arr4, arr5)).toBe(true);
  });

  test('Should return false if items are arrays containing different nested array values', function() {
    expect(isEqual(arr4, arr6)).toBe(false);
  });

  test('Should return true if items are objects with identical keys and values', function() {
    expect(isEqual(obj1, obj2)).toBe(true);
  });

  test('Should return true if items are objects with identical keys and values, including nested objects and arrays', function() {
    expect(isEqual(obj4, obj5)).toBe(true);
  });

  test('Should return false if items are objects with identical keys but different values', function() {
    expect(isEqual(obj1, obj3)).toBe(false);
  });

  test('Should return false if items are objects with identical keys but different nested object values', function() {
    expect(isEqual(obj4, obj6)).toBe(false);
  });
});
