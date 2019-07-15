import { isAlignedHorizontal, flipHorizontal, flipVertical } from '../Positioner/utils';

export function getArrowPosition(tooltipPosition) {
  return isAlignedHorizontal(tooltipPosition)
    ? flipVertical(tooltipPosition)
    : flipHorizontal(tooltipPosition);
}
