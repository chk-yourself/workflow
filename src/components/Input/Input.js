import React from 'react';
import './Input.scss';

const Input = ({
  className = '',
  name,
  type,
  value,
  onFocus,
  onChange,
  onInput,
  placeholder,
  isRequired,
  onBlur,
  autoComplete,
  innerRef,
  hideLabel,
  label,
  labelClass,
  onKeyDown,
  maxLength,
  minLength,
  isReadOnly
}) => {
  return (
    <>
      {!hideLabel && (
        <label htmlFor={name} className={`input__label ${labelClass}`}>
          {label}
        </label>
      )}
      <input
        className={`input ${className}`}
        id={name}
        name={name}
        type={type}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        placeholder={placeholder}
        required={isRequired}
        onBlur={onBlur}
        autoComplete={autoComplete}
        ref={innerRef}
        onInput={onInput}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
        minLength={minLength}
        readOnly={isReadOnly}
        tabIndex={isReadOnly ? -1 : 0}
      />
    </>
  );
};

Input.defaultProps = {
  className: '',
  innerRef: null
};

export default Input;
