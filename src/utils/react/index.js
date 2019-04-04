export const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export const generateKey = () =>
  +Date.now() +
  Math.random()
    .toString(36)
    .slice(2);
