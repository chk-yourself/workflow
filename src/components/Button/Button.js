import React from 'react';
import './Button.scss';

const Button = ({
  children,
  type,
  onClick,
  className,
  color = 'neutral',
  size = 'medium',
  variant = 'text',
  disabled,
  name,
  iconOnly = false,
  buttonRef,
  ...props
}) => (
  <button
    className={`${className} ${color} ${size} ${variant} ${
      iconOnly ? 'icon-only' : ''
    }`}
    type={type}
    onClick={onClick}
    disabled={disabled}
    name={name}
    ref={buttonRef}
  >
    {children}
  </button>
);

export default Button;
