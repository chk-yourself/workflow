import { useState, useCallback } from 'react';

function useToggle(initial) {
  const [open, setOpen] = useState(initial);
  return [open, useCallback(() => setOpen(status => !status))];
}

export default useToggle;
