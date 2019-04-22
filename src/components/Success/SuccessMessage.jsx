import React from 'react';
import './Success.scss';
import { Icon } from '../Icon';

const SuccessMessage = ({ className, text }) => (
  <p className={`message--success ${className}`}>
    <Icon name="check-circle" />
    {text}
  </p>
);

SuccessMessage.defaultProps = {
  className: ''
};

export default SuccessMessage;
