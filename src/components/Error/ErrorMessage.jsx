import React from 'react';
import './Error.scss';
import { Icon } from '../Icon';

const ErrorMessage = ({ className, error }) => (
  <p className={`message--error ${className}`}>
    <Icon name="alert-circle" />
    {error.message}
  </p>
);

ErrorMessage.defaultProps = {
  className: ''
};

export default ErrorMessage;
