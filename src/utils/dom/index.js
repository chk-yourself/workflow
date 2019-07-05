/**
 * @return {Function} - A function that resets body overflow attribute to original value
 */
export function lockBodyScroll() {
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = previousOverflow || '';
  };
}
