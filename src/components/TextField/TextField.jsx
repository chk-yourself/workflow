import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../Input';
import './TextField.scss';

/**
 * Combines text input, label, validation message into one component
 * label is required
 * Used for traditional forms
 */

const TextField = ({ id, type, className, label, labelClass, ...props }) => (
  <Input
    type={type}
    label={label}
    labelClass={`text-field__label ${labelClass}`}
    className={`text-field ${className}`}
    id={id}
    {...props}
  />
);

TextField.defaultProps = {
  type: 'text',
  labelClass: '',
  className: ''
};

TextField.propTypes = {
  type: PropTypes.oneOf(['text', 'password', 'email']),
  label: PropTypes.string.isRequired,
  labelClass: PropTypes.string,
  className: PropTypes.string
};

export default TextField;
