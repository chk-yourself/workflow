import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Position from '../../constants/positions';
import getPosition from './utils';
import { Portal } from '../Portal';
import { windowDebounce as debounce } from '../../utils/function';

export default class Positioner extends Component {
  static propTypes = {
    target: PropTypes.func.isRequired,
    targetOffset: PropTypes.number, // min distance from target to element being positioned
    viewportOffset: PropTypes.number, // min distance from viewport to element being positioned
    position: PropTypes.oneOf([
      Position.TOP,
      Position.TOP_LEFT,
      Position.TOP_RIGHT,
      Position.BOTTOM,
      Position.BOTTOM_LEFT,
      Position.BOTTOM_RIGHT,
      Position.LEFT,
      Position.RIGHT
    ]),
    children: PropTypes.func.isRequired,
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
    isVisible: PropTypes.bool
  };

  static defaultProps = {
    targetOffset: 4,
    viewportOffset: 8,
    position: Position.BOTTOM,
    innerRef: () => {},
    isVisible: false
  };

  state = {
    left: null,
    top: null,
    transformOrigin: null,
    viewport: null,
    dimensions: null,
    position: this.props.position
  };

  componentDidMount() {
    this.updatePosition();
    this.handleResize = debounce(this.updatePosition);
    this.handleScroll = debounce(this.updatePosition);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isVisible &&
      prevProps.isVisible !== this.props.isVisible &&
      this.positionerRef
    ) {
      setTimeout(() => {
        this.updatePosition();
      }, 0);
    }
  }

  componentWillUnmount() {
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
    }
    if (this.handleScroll) {
      window.removeEventListener('scroll', this.handleScroll);
    }
    if (this.initAnimationFrame) {
      window.cancelAnimationFrame(this.initAnimationFrame);
    }
  }

  getRef = el => {
    this.positionerRef = el;
    const { innerRef } = this.props;
    innerRef(el);
  };

  getTargetRef = el => {
    this.targetRef = el;
  };

  // Returns object containing width and height of viewport
  getViewport = () => {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight
    };
  };

  // Returns object containing width and height of positioner ref
  getDimensions = () => {
    const { width, height } = this.positionerRef.getBoundingClientRect();
    return {
      width,
      height
    };
  };

  updatePosition = e => {
    const { isVisible, position, targetOffset, viewportOffset } = this.props;
    if (!this.targetRef || !this.positionerRef || !isVisible) return;
    const isScrollEvent = e && e.type && e.type === 'scroll';
    const { dimensions: prevDimensions, viewport: prevViewport } = this.state;
    // If scroll event, use stored viewport and positioner ref dimensions
    const dimensions =
      isScrollEvent && prevDimensions ? prevDimensions : this.getDimensions();
    const viewport = isScrollEvent && prevViewport ? prevViewport : this.getViewport();
    const targetRect = this.targetRef.getBoundingClientRect();
    const { rect, position: finalPosition, transformOrigin } = getPosition({
      position,
      targetRect,
      targetOffset,
      dimensions,
      viewport,
      viewportOffset
    });

    this.setState({
      left: rect.left,
      top: rect.top,
      transformOrigin,
      dimensions: this.getDimensions(),
      viewport: this.getViewport(),
      position: finalPosition
    });
  };

  render() {
    const { target, children, isVisible, portalId } = this.props;
    const { top, left, transformOrigin, position } = this.state;
    return (
      <>
        {target({ getRef: this.getTargetRef })}
        {isVisible && (
          <Portal id={portalId}>
            {children({
              top,
              left,
              position,
              style: {
                top,
                left,
                transformOrigin,
                position: 'fixed'
              },
              getRef: this.getRef
            })}
          </Portal>
        )}
      </>
    );
  }
}
