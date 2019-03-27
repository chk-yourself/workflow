import React from 'react';
import './Button.scss';

const Button = ({
  children,
  type = 'button',
  onClick,
  className = '',
  color = 'neutral',
  size = 'md',
  variant = 'text',
  disabled,
  name,
  iconOnly = false,
  value,
  innerRef,
  isActive,
  ...props
}) => (
  // eslint-disable-next-line react/button-has-type
  <button
    className={`${className} ${variant}--${color} ${!iconOnly ? size : ''} ${
      iconOnly ? `icon-only icon-only--${size}` : ''
    } ${isActive ? 'is-active' : ''}`}
    type={type}
    onClick={onClick}
    disabled={disabled}
    name={name}
    value={value}
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
  iconOnly: false,
  ref: null,
  isActive: false,
  value: '',
  name: ''
};

export default Button;
