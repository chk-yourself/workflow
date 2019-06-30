import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon';
import './Badge.scss';

const Badge = ({ icon, children, className, text }) => (
  <span className={`badge ${className}`}>
    {icon && <Icon name={icon} />}
    {text}
    {children}
  </span>
);

Badge.defaultProps = {
  icon: '',
  className: '',
  children: null
};

Badge.propTypes = {
  icon: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
};

export default memo(Badge);
