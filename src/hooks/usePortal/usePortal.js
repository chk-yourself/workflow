import { useRef, useEffect } from 'react';

function createRootElement(id) {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
}

function addRootElement(rootElem) {
  document.body.appendChild(rootElem);
}

function usePortal(id) {
  const rootRef = useRef(null);

  useEffect(() => {
    const existingParent = document.querySelector(`#${id}`);
    const parentElem = existingParent || createRootElement(id);

    if (!existingParent) {
      addRootElement(parentElem);
    }

    parentElem.appendChild(rootRef.current);

    return function removeElement() {
      rootRef.current.remove();
      if (!existingParent) {
        parentElem.remove();
      }
    };
  }, []);

  function getRootElem() {
    if (!rootRef.current) {
      rootRef.current = document.createElement('div');
    }
    return rootRef.current;
  }
  return getRootElem();
}

export default usePortal;
