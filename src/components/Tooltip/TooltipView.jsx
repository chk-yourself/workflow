import React from 'react';
import PropTypes from 'prop-types';
import TooltipArrow from './TooltipArrow';
import * as Position from '../../constants/positions';
import { getArrowPosition } from './utils';
import './Tooltip.scss';

const TooltipView = ({
  style,
  maxWidth,
  padding,
  innerRef,
  className,
  children,
  hasArrow,
  position,
  arrowPosition,
  arrowProps,
  ...props
}) => {
  return (
    <div
      ref={innerRef}
      className={`tooltip ${className}`}
      style={{ maxWidth, padding, ...style }}
      {...props}
    >
      {hasArrow && (
        <TooltipArrow
          position={arrowPosition || getArrowPosition(position)}
          {...arrowProps}
        />
      )}
      {children}
    </div>
  );
};

TooltipView.defaultProps = {
  className: '',
  style: {},
  innerRef: () => {},
  maxWidth: 192,
  padding: 12,
  hasArrow: false,
  position: null,
  arrowPosition: null,
  arrowProps: {}
};

TooltipView.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hasArrow: PropTypes.bool,
  position: PropTypes.oneOf([
    null,
    Position.TOP,
    Position.TOP_LEFT,
    Position.TOP_RIGHT,
    Position.BOTTOM,
    Position.BOTTOM_LEFT,
    Position.BOTTOM_RIGHT,
    Position.LEFT,
    Position.RIGHT
  ]),
  arrowPosition: PropTypes.oneOf([
    null,
    Position.TOP,
    Position.TOP_LEFT,
    Position.TOP_RIGHT,
    Position.BOTTOM,
    Position.BOTTOM_LEFT,
    Position.BOTTOM_RIGHT,
    Position.LEFT,
    Position.RIGHT
  ]),
  arrowProps: PropTypes.objectOf(PropTypes.any)
};

export default TooltipView;
