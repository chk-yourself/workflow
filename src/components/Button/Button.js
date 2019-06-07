/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
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
  value: '',
  name: '',
  iconOnly: false,
  isActive: false,
  ref: null,
  onClick: () => null,
  onMouseDown: () => null
};

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  iconOnly: PropTypes.bool,
  isActive: PropTypes.bool,
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func
};

export default Button;
