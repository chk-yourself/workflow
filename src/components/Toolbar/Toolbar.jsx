import React from 'react';
import PropTypes from 'prop-types';
import './Toolbar.scss';

const Toolbar = ({ className, children, isActive, ...props }) => (
  <div className={`toolbar ${className} ${isActive ? 'is-active' : ''} `} {...props}>
    {children}
  </div>
);

Toolbar.defaultProps = {
  className: '',
  isActive: true
};

Toolbar.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool
};

export default Toolbar;
