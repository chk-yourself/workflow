import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { Icon } from '../Icon';
import './IconButton.scss';

const IconButton = ({ icon, type, size, className, innerRef, label, ...props }) => (
  <Button
    type={type}
    size={size}
    innerRef={innerRef}
    className={`icon-btn icon-btn--${size} ${className}`}
    aria-label={label}
    {...props}
  >
    <Icon name={icon} />
  </Button>
);

IconButton.defaultProps = {
  className: '',
  size: 'md',
  type: 'button'
};

IconButton.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default memo(IconButton);
