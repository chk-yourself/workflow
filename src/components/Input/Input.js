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
  isReadOnly,
  ...rest
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
        {...rest}
      />
    </>
  );
};

Input.defaultProps = {
  className: '',
  innerRef: null,
  labelClass: ''
};

export default Input;
