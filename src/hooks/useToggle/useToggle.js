import { useState, useCallback } from 'react';

function useToggle(initial) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(
    nextValue => {
      if (typeof nextValue === 'boolean') {
        setValue(nextValue);
      } else {
        setValue(currentValue => !currentValue);
      }
    },
    [setValue]
  );
  return [value, toggle];
}

export default useToggle;
