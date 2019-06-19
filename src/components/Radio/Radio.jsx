import React from 'react';

const Radio = ({
  classes,
  name,
  id,
  value,
  onFocus,
  onChange,
  onInput,
  isRequired,
  onBlur,
  inputRef,
  hideLabel,
  label,
  onKeyDown,
  isChecked,
  ...rest
}) => {
  return (
    <>
      <input
        className={`radio ${classes.radio}`}
        id={id}
        name={name}
        type="radio"
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
        ref={inputRef}
        onInput={onInput}
        onKeyDown={onKeyDown}
        required={isRequired}
        checked={isChecked}
        {...rest}
      />
      {!hideLabel && (
        <label htmlFor={id} className={`radio__label ${classes.label}`}>
          {label}
        </label>
      )}
    </>
  );
};

Radio.defaultProps = {
  classes: {
    radio: '',
    label: ''
  }
};

export default Radio;
