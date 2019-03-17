import React from 'react';
import { Icon } from '../Icon';
import './Badge.scss';

const Badge = ({ icon, children, className }) => (
  <span className={`badge ${className}`}>
    {icon && <Icon name={icon} />}
    {children}
  </span>
);

Badge.defaultProps = {
  icon: null,
  className: '',
  children: null
};

export default Badge;
