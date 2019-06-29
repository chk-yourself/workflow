export const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

/**
 * Generates random unique number
 */
export const generateKey = () =>
  +Date.now() +
  Math.random()
    .toString(36)
    .slice(2);

export function setDocTitle(title) {
  document.title = title;
}
