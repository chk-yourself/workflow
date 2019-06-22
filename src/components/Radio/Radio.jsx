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
  labelProps,
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
        <label htmlFor={id} className={`radio__label ${classes.label}`} {...labelProps}>
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
  },
  labelProps: {}
};

Radio.propTypes = {
  classes: PropTypes.shape({
    radio: PropTypes.string,
    label: PropTypes.string
  }),
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.objectOf(PropTypes.oneOf([PropTypes.string, PropTypes.number]))
};

export default Radio;
