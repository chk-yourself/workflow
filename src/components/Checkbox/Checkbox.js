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
  ...props
}) => {
  return (
    <label
      htmlFor={id}
      onClick={onClick}
      className={`checkbox__label ${labelClass}`}
    >
      {isChecked && <Icon name="check" />}
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
    </label>
  );
};

export default Checkbox;
