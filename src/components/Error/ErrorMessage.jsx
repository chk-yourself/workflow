import React from 'react';
import './Error.scss';
import { Icon } from '../Icon';

const ErrorMessage = ({ className, text, id }) => (
  <p id={id} className={`message--error ${className}`}>
    <Icon name="alert-circle" />
    {text}
  </p>
);

ErrorMessage.defaultProps = {
  className: ''
};

export default ErrorMessage;
