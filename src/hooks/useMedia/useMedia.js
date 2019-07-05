import { useState, useEffect } from 'react';

/**
 *
 * @param {string[]} queries -
 * @param {Array} values
 * @param {*} defaultValue
 * @example
 */
export default function useMedia(queries, values, defaultValue) {
  const mediaQueryLists = queries.map(query => window.matchMedia(query));

  // Returns the first media query that matches, so order matters
  // min-width - descending order
  // max-width - ascending order
  const getValue = () => {
    const index = mediaQueryLists.findIndex(item => item.matches);
    return values[index] || defaultValue;
  };

  const [value, setValue] = useState(getValue);

  useEffect(
    () => {
      const handler = () => setValue(getValue);
      mediaQueryLists.forEach(item => item.addListener(handler));
      return () => mediaQueryLists.forEach(item => item.removeListener(handler));
    },
    [] // Only run on mount and unmount
  );
  return value;
}
