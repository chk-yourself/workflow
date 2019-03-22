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
  innerRef,
  ...props
}) => (
  // eslint-disable-next-line react/button-has-type
  <button
    className={`${className} ${variant}--${color} ${!iconOnly ? size : ''} ${
      iconOnly ? `icon-only icon-only--${size}` : ''
    }`}
    type={type}
    onClick={onClick}
    disabled={disabled}
    name={name}
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
  ref: null
};

export default Button;
