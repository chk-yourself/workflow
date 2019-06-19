import React from 'react';
import PropTypes from 'prop-types';

const Radio = ({
  classes,
  name,
  id,
  value,
  isRequired,
  inputRef,
  hideLabel,
  label,
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
        ref={inputRef}
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

Radio.propTypes = {
  classes: PropTypes.shape({
    radio: PropTypes.string,
    label: PropTypes.string
  }),
  name: PropTypes.string.isRequired
};

export default Radio;
