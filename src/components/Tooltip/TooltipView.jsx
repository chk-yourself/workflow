import React from 'react';
import PropTypes from 'prop-types';
import './Tooltip.scss';

const TooltipView = ({ style, maxWidth, padding, innerRef, className, children, ...props }) => {
  return (
    <div ref={innerRef} className={`tooltip ${className}`} style={{maxWidth, padding, ...style}} {...props}>
      {children}
    </div>
  );
};

TooltipView.defaultProps = {
  className: '',
  style: {},
  innerRef: () => {},
  maxWidth: 192,
  padding: 12
};

TooltipView.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default TooltipView;
