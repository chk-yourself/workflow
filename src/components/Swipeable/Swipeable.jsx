import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Returns x and y coordinates of given mouse or touch event
 * @param {Event} event - mouse or touch event to track
 */
function getCoords(event) {
  const { clientX, clientY } = 'touches' in event ? event.touches[0] : event;
  return { x: clientX, y: clientY };
}

const INITIAL_STATE = {
  startPosition: null,
  movePosition: null,
  isSwiping: false
};

export default class Swipeable extends Component {
  static defaultProps = {
    tolerance: 0,
    allowMouseEvents: false,
    isSwipeDisabled: false,
    innerRef: () => null,
    onSwipeStart: () => {},
    onSwipeEnd: () => {},
    onSwipeMove: () => {},
    onSwipeUp: () => {},
    onSwipeDown: () => {},
    onSwipeLeft: () => {},
    onSwipeRight: () => {}
  };

  static propTypes = {
    tolerance: PropTypes.number,
    isSwipeDisabled: PropTypes.bool,
    allowMouseEvents: PropTypes.bool,
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
    onSwipeStart: PropTypes.func,
    onSwipeEnd: PropTypes.func,
    onSwipeMove: PropTypes.func,
    onSwipeUp: PropTypes.func,
    onSwipeDown: PropTypes.func,
    onSwipeLeft: PropTypes.func,
    onSwipeRight: PropTypes.func
  };

  state = { ...INITIAL_STATE };

  componentWillUnmount() {
    if (this.mouseDown) {
      this.cleanUpMouseListeners();
    }
  }

  setRef = el => {
    const { innerRef } = this.props;
    this.el = el;

    if (innerRef) {
      innerRef(el);
    }
  };

  onMouseDown = e => {
    const { allowMouseEvents, isSwipeDisabled } = this.props;
    if (!allowMouseEvents || isSwipeDisabled) return;

    this.mouseDown = true;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    this.handleSwipeStart(e);
  };

  onMouseMove = e => {
    if (!this.mouseDown) return;

    this.handleSwipeMove(e);
  };

  onMouseUp = e => {
    this.mouseDown = false;

    this.cleanUpMouseListeners();
    this.handleSwipeEnd(e);
  };

  cleanUpMouseListeners = () => {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  };

  handleSwipeStart = e => {
    const { onSwipeStart, isSwipeDisabled } = this.props;
    if (isSwipeDisabled) return;
    const startPosition = getCoords(e);
    this.setState({ startPosition });
    onSwipeStart(e);
  };

  handleSwipeMove = e => {
    const { startPosition } = this.state;
    if (!startPosition) return;
    const { x: startX, y: startY } = startPosition;
    const { onSwipeMove } = this.props;
    const { x: currentX, y: currentY } = getCoords(e);
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const movePosition = {
      deltaX,
      deltaY
    };
    this.setState({ movePosition, isSwiping: true });
    onSwipeMove({ x: deltaX, y: deltaY }, e);
  };

  handleSwipeEnd = e => {
    const {
      tolerance,
      onSwipeEnd,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown
    } = this.props;
    const { movePosition, isSwiping } = this.state;
    if (!movePosition || !isSwiping) return;
    const { deltaX, deltaY } = movePosition;
    let direction = '';

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < -tolerance) {
        onSwipeLeft(e);
        direction = 'left';
      } else if (deltaX > tolerance) {
        onSwipeRight(e);
        direction = 'right';
      }
    } else if (deltaY < -tolerance) {
      onSwipeUp(e);
      direction = 'up';
    } else if (deltaY > tolerance) {
      onSwipeDown(e);
      direction = 'down';
    }
    onSwipeEnd({ deltaX, deltaY, direction }, e);
    this.reset();
  };

  reset = () => {
    this.setState({ ...INITIAL_STATE });
  };

  render() {
    const { children } = this.props;

    const { isSwiping, movePosition } = this.state;
    const { deltaX = 0, deltaY = 0 } = movePosition || {};

    const provided = {
      swipeableProps: {
        onTouchStart: this.handleSwipeStart,
        onTouchMove: this.handleSwipeMove,
        onTouchEnd: this.handleSwipeEnd,
        onMouseDown: this.onMouseDown
      },
      innerRef: this.setRef
    };

    const snapshot = {
      isSwiping,
      deltaX,
      deltaY
    };

    return children(provided, snapshot);
  }
}
