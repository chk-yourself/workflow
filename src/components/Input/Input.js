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
  inputRef,
  hideLabel,
  label,
  labelClass,
  onKeyDown
}) => {
  return (
    <>
      {!hideLabel && (
        <label htmlFor={name} className={`input__label ${labelClass}`}>
          {label}
        </label>
      )}
      <input
        className={className}
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
        ref={inputRef}
        onInput={onInput}
        onKeyDown={onKeyDown}
      />
    </>
  );
};

export default Input;
