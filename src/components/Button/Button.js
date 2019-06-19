/* eslint-disable react/button-has-type */
import React from 'react';
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
  ...props
}) => (
  <button
    className={`${className} ${variant} ${variant}--${intent || color} ${
      iconOnly ? `icon-only icon-only--${size}` : `btn--${size}`
    } ${isActive ? 'is-active' : ''}`}
    type={type}
    onClick={onClick}
    onMouseDown={onMouseDown}
    disabled={disabled}
    ref={innerRef}
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
  value: '',
  name: '',
  iconOnly: false,
  isActive: false,
  onClick: () => null,
  onMouseDown: () => null,
  innerRef: () => null
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  iconOnly: PropTypes.bool,
  isActive: PropTypes.bool,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func
};

export default Button;
