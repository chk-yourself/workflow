import React from 'react';

const Radio = ({
  classes = { radio: '', label: '' },
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
  isChecked
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
      />
      {!hideLabel && (
        <label htmlFor={id} className={`radio__label ${classes.label}`}>
          {label}
        </label>
      )}
    </>
  );
};

export default Radio;
