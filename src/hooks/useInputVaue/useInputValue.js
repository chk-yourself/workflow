import { useState } from 'react';

function useInputValue(initialValue) {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: e => {
      setValue(e.target.value);
    }
  };
}

export default useInputValue;
