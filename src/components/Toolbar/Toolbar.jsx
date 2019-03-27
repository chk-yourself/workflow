import React from 'react';
import './Toolbar.scss';

const Toolbar = ({ className, children, isActive, ...props }) => (
  <div
    className={`toolbar ${className} ${isActive ? 'is-active' : ''} `}
    {...props}
  >
    {children}
  </div>
);

Toolbar.defaultProps = {
  className: '',
  isActive: true
};

export default Toolbar;
