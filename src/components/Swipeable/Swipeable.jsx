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
    className: '',
    is: 'div',
    tolerance: 0,
    disableMouseEvents: false,
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
    className: PropTypes.string,
    is: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    tolerance: PropTypes.number,
    disableMouseEvents: PropTypes.bool,
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
    const { disableMouseEvents } = this.props;
    if (disableMouseEvents) return;

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
    const { onSwipeStart } = this.props;
    const startPosition = getCoords(e);
    this.setState({ startPosition });
    onSwipeStart(e);
  };

  handleSwipeMove = e => {
    const { startPosition } = this.state;
    if (!startPosition) return;
    const { x: startX, y: startY } = startPosition;
    const { onSwipeMove } = this.props;
    const { x: endX, y: endY } = getCoords(e);
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const movePosition = {
      deltaX,
      deltaY
    };
    this.setState({ movePosition, isSwiping: true });
    onSwipeMove(e);
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
    onSwipeEnd(e);
    const { deltaX, deltaY } = movePosition;

    if (deltaX < -tolerance) {
      onSwipeLeft(e);
    }

    if (deltaX > tolerance) {
      onSwipeRight(e);
    }

    if (deltaY < -tolerance) {
      onSwipeUp(e);
    }

    if (deltaY > tolerance) {
      onSwipeDown(e);
    }
    this.reset();
  };

  reset = () => {
    this.setState({ ...INITIAL_STATE });
  };

  render() {
    const {
      children,
      is,
      disableMouseEvents,
      className,
      innerRef,
      tolerance,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight,
      onSwipeStart,
      onSwipeMove,
      onSwipeEnd,
      ...rest
    } = this.props;
    return (
      <this.props.is
        ref={this.setRef}
        className={className}
        onTouchStart={this.handleSwipeStart}
        onTouchMove={this.handleSwipeMove}
        onTouchEnd={this.handleSwipeEnd}
        onMouseDown={this.onMouseDown}
        {...rest}
      >
        {children}
      </this.props.is>
    );
  }
}
