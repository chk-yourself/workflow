/* eslint-disable react/button-has-type */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

const Button = ({
  children,
  type,
  onClick,
  onMouseDown,
  className,
  color,
  size,
  variant,
  disabled,
  iconOnly,
  innerRef,
  isActive,
  intent,
  label,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  style,
  ...props
}) => (
  <button
    className={`btn ${className} ${variant} ${variant}--${intent || color} ${
      iconOnly ? `icon-only icon-only--${size}` : `btn--${size}`
    } ${isActive ? 'is-active' : ''}`}
    type={type}
    onClick={onClick}
    onMouseDown={onMouseDown}
    disabled={disabled}
    ref={innerRef}
    aria-label={label}
    style={{ ...style, marginTop, marginBottom, marginRight, marginLeft }}
    {...props}
  >
    {children}
  </button>
);

Button.defaultProps = {
  type: 'button',
  className: '',
  color: 'neutral',
  size: 'md',
  variant: 'text',
  iconOnly: false,
  isActive: false,
  onClick: () => null,
  onMouseDown: () => null,
  innerRef: () => null,
  style: {}
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['contained', 'outlined', 'text', 'underlined']),
  iconOnly: PropTypes.bool,
  isActive: PropTypes.bool,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};

export default memo(Button);
