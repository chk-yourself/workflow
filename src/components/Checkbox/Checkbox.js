import React from 'react';
import { Icon } from '../Icon';
import './Checkbox.scss';

const Checkbox = ({
  value,
  id,
  name,
  isChecked,
  onClick,
  onChange,
  className,
  labelClass,
  label,
  ...props
}) => {
  return (
    <label
      htmlFor={id}
      onClick={onClick}
      className={`checkbox__label ${isChecked ? 'is-checked' : ''} ${labelClass}`}
    >
      <Icon name="check" />
      <input
        type="checkbox"
        id={id}
        value={value}
        name={name}
        checked={isChecked}
        className={`checkbox ${className}`}
        onChange={onChange}
        {...props}
      />
      {label && label}
    </label>
  );
};

Checkbox.defaultProps = {
  className: '',
  labelClass: '',
  label: ''
};

export default Checkbox;
