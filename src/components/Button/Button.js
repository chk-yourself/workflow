/* eslint-disable react/button-has-type */
import React from 'react';
import './Button.scss';

const Button = ({
  children,
  type = 'button',
  onClick,
  onMouseDown,
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
  <button
    className={`${className} ${variant} ${variant}--${color} ${
      iconOnly ? `icon-only icon-only--${size}` : `btn--${size}`
    } ${isActive ? 'is-active' : ''}`}
    type={type}
    onClick={onClick}
    onMouseDown={onMouseDown}
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
  name: '',
  onClick: () => null,
  onMouseDown: () => null
};

export default Button;
