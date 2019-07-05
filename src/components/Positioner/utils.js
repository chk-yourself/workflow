import * as Position from '../../constants/positions';

const makeRect = ({ width, height }, { left, top }) => {
  return {
    width,
    height,
    left,
    top,
    right: left + width,
    bottom: top + height
  };
};

// Flips position upside down
const flipHorizontal = position => {
  switch (position) {
    case Position.TOP_LEFT:
      return Position.BOTTOM_LEFT;
    case Position.TOP_RIGHT:
      return Position.BOTTOM_RIGHT;
    case Position.BOTTOM_LEFT:
      return Position.TOP_LEFT;
    case Position.BOTTOM:
      return Position.TOP;
    case Position.BOTTOM_RIGHT:
      return Position.TOP_RIGHT;
    case Position.TOP:
    default:
      return Position.BOTTOM;
  }
};

// Returns true if rect fits above viewport bottom
const canFitOnBottom = (rect, viewport, viewportOffset) => {
  return rect.bottom < viewport.height - viewportOffset;
};

// Returns true if rect fits below viewport top
const canFitOnTop = (rect, viewportOffset) => {
  return rect.top > viewportOffset;
};

// Returns true if rect fits to the right of viewport
const canFitOnRight = (rect, viewport, viewportOffset) => {
  return rect.right < viewport.width - viewportOffset;
};

// Returns true if rect fits to the left of viewport
const canFitOnLeft = (rect, viewportOffset) => {
  return rect.left > viewportOffset;
};

// Returns true if position is vertically centered on the x-axis
const isAlignedHorizontal = position => {
  return position === Position.LEFT || position === Position.RIGHT;
};

// Returns true if position is aligned to the top
const isAlignedOnTop = position => {
  return (
    position === Position.TOP ||
    position === Position.TOP_LEFT ||
    position === Position.TOP_RIGHT
  );
};

// Returns the CSS `transform-origin` property
const getTransformOrigin = ({ rect, position, dimensions, targetCenter }) => {
  const centerY = Math.round(targetCenter - rect.top);

  if (position === Position.LEFT) {
    return `${dimensions.width}px ${centerY}px`;
  }

  if (position === Position.RIGHT) {
    return `0px ${centerY}px`;
  }

  const centerX = Math.round(targetCenter - rect.left);

  if (isAlignedOnTop(position)) {
    return `${centerX}px ${dimensions.height}px `;
  }

  return `${centerX}px 0px `;
};

/**
 *
 * @param {String} position - The placement of positioner
 * @param {Number} targetOffset - The min. offset from the target
 * @param {Object} dimensions - The width and height of positioner
 * @param {Object} targetRect - the bounding client rect of target
 * @return {Object} - { width, height, left, top, right, bottom }
 */
const getRect = ({ position, dimensions, targetRect, targetOffset }) => {
  const alignedCenterY = targetRect.top + targetRect.height / 2 - dimensions.height / 2;
  const alignedCenterX = targetRect.left + targetRect.width / 2 - dimensions.width / 2;
  const alignedTopY = targetRect.top - dimensions.height - targetOffset;
  const alignedBottomY = targetRect.bottom + targetOffset;
  const alignedRightX = targetRect.right - dimensions.width;

  switch (position) {
    case Position.LEFT: {
      return makeRect(dimensions, {
        left: targetRect.left - dimensions.width - targetOffset,
        top: alignedCenterY
      });
    }
    case Position.RIGHT: {
      return makeRect(dimensions, {
        left: targetRect.right + targetOffset,
        top: alignedCenterY
      });
    }
    case Position.TOP: {
      return makeRect(dimensions, {
        left: alignedCenterX,
        top: alignedTopY
      });
    }
    case Position.TOP_LEFT: {
      return makeRect(dimensions, {
        left: targetRect.left,
        top: alignedTopY
      });
    }
    case Position.TOP_RIGHT: {
      return makeRect(dimensions, {
        left: alignedRightX,
        top: alignedTopY
      });
    }
    case Position.BOTTOM_LEFT: {
      return makeRect(dimensions, {
        left: targetRect.left,
        top: alignedBottomY
      });
    }
    case Position.BOTTOM_RIGHT: {
      return makeRect(dimensions, {
        left: alignedRightX,
        top: alignedBottomY
      });
    }
    default:
    case Position.BOTTOM: {
      return makeRect(dimensions, {
        left: alignedCenterX,
        top: alignedBottomY
      });
    }
  }
};

/**
 * Returns starting rect and position of positioner
 * @param {String} position - The placement of positioner
 * @param {Object} dimensions - The width and height of positioner
 * @param {Object} targetRect - The bounding client rect of target
 * @param {Number} targetOffset - The min distance from target
 * @param {Object} viewport - The width and height of the viewport
 * @param {Number} viewportOffset - The min distance from viewport
 * @return {Object} - { rect: Rect, position: Position }
 */
const getPositionedRect = ({
  position,
  dimensions,
  targetRect,
  targetOffset,
  viewport,
  viewportOffset
}) => {
  const isHorizontal = isAlignedHorizontal(position);

  if (isHorizontal) {
    const leftRect = getRect({
      position: Position.LEFT,
      dimensions,
      targetRect,
      targetOffset
    });
    const rightRect = getRect({
      position: Position.RIGHT,
      dimensions,
      targetRect,
      targetOffset
    });
    const fitsOnLeft = canFitOnLeft(leftRect, viewportOffset);
    const fitsOnRight = canFitOnRight(rightRect, viewport, viewportOffset);

    if (position === Position.LEFT) {
      if (fitsOnLeft) {
        return {
          position,
          rect: leftRect
        };
      }

      if (fitsOnRight) {
        return {
          position,
          rect: rightRect
        };
      }
    }

    if (position === Position.RIGHT) {
      if (fitsOnRight) {
        return {
          position,
          rect: rightRect
        };
      }

      if (fitsOnLeft) {
        return {
          position: Position.LEFT,
          rect: leftRect
        };
      }
    }
    const spaceRight = Math.abs(viewport.width - viewportOffset - rightRect.right);
    const spaceLeft = Math.abs(leftRect.left - viewportOffset);

    if (spaceRight < spaceLeft) {
      return {
        position: Position.RIGHT,
        rect: rightRect
      };
    }
    return {
      position: Position.LEFT,
      rect: leftRect
    };
  }

  const isOnTop = isAlignedOnTop(position);
  let topRect;
  let bottomRect;
  if (isOnTop) {
    topRect = getRect({
      position,
      dimensions,
      targetRect,
      targetOffset
    });
    bottomRect = getRect({
      position: flipHorizontal(position),
      dimensions,
      targetRect,
      targetOffset
    });
  } else {
    topRect = getRect({
      position: flipHorizontal(position),
      dimensions,
      targetRect,
      targetOffset
    });
    bottomRect = getRect({
      position,
      dimensions,
      targetRect,
      targetOffset
    });
  }

  const fitsOnTop = canFitOnTop(topRect, viewportOffset);
  const fitsOnBottom = canFitOnBottom(bottomRect, viewport, viewportOffset);

  if (isOnTop) {
    if (fitsOnTop) {
      return {
        position,
        rect: topRect
      };
    }
    if (fitsOnBottom) {
      return {
        position: flipHorizontal(position),
        rect: bottomRect
      };
    }
  } else {
    if (fitsOnBottom) {
      return {
        position,
        rect: bottomRect
      };
    }
    if (fitsOnTop) {
      return {
        position: flipHorizontal(position),
        rect: topRect
      };
    }
  }
  const spaceBottom = Math.abs(viewport.height - viewportOffset - bottomRect.bottom);
  const spaceTop = Math.abs(topRect.top - viewportOffset);
  if (spaceBottom < spaceTop) {
    return {
      position: isOnTop ? flipHorizontal(position) : position,
      rect: bottomRect
    };
  }
  return {
    position: isOnTop ? position : flipHorizontal(position),
    rect: topRect
  };
};

/**
 * Returns final rect and position of positioner
 * @param {String} position - The placement of positioner
 * @param {Object} dimensions - The width and height of positioner
 * @param {Object} targetRect - The bounding client rect of target
 * @param {Number} targetOffset - The min distance from target
 * @param {Object} viewport - The width and height of the viewport
 * @param {Number} viewportOffset - The min distance from viewport
 * @return {Object} - { rect: Rect, position: Position }
 */
export default function getPosition({
  position,
  dimensions,
  targetRect,
  targetOffset,
  viewport,
  viewportOffset
}) {
  const { rect, position: finalPosition } = getPositionedRect({
    position,
    dimensions,
    targetRect,
    targetOffset,
    viewport,
    viewportOffset
  });

  // Shift rect to right if overflowing on the left side of viewport
  if (rect.left < viewportOffset) {
    rect.right += Math.abs(rect.left - viewportOffset);
    rect.left = viewportOffset;
  }

  // Shift rect to left if overflowing on right side of viewport
  if (rect.right > viewport.width - viewportOffset) {
    const delta = rect.right - (viewport.width - viewportOffset);
    rect.left -= delta;
    rect.right -= delta;
  }

  // Shift rect downward if overflowing on the top side of viewport
  if (rect.top < viewportOffset) {
    rect.top += Math.abs(rect.top - viewportOffset);
    rect.bottom = viewportOffset;
  }

  // Shift rect upward if overflowing on bottom side of viewport
  if (rect.bottom > viewport.height - viewportOffset) {
    const delta = rect.bottom - (viewport.height - viewportOffset);
    rect.top -= delta;
    rect.bottom -= delta;
  }
  const targetCenter = isAlignedHorizontal(position)
    ? targetRect.top + targetRect.height / 2
    : targetRect.left + targetRect.width / 2;
  const transformOrigin = getTransformOrigin({
    rect,
    position: finalPosition,
    dimensions,
    targetCenter
  });

  return {
    rect,
    position: finalPosition,
    transformOrigin
  };
}
