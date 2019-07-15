import React from 'react';
import PropTypes from 'prop-types';
import * as Position from '../../constants/positions';

const TooltipArrow = ({ className, position, ...props }) => {
  return (
    <div
      className={`tooltip__arrow tooltip__arrow--${position} ${className}`}
      {...props}
    />
  );
};

TooltipArrow.defaultProps = {
  className: ''
};

TooltipArrow.propTypes = {
  className: PropTypes.string,
  position: PropTypes.oneOf([
    Position.TOP,
    Position.TOP_LEFT,
    Position.TOP_RIGHT,
    Position.BOTTOM,
    Position.BOTTOM_LEFT,
    Position.BOTTOM_RIGHT,
    Position.LEFT,
    Position.RIGHT
  ]).isRequired
};

export default TooltipArrow;
