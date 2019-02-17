import React from 'react';
import './Toolbar.scss';

const Toolbar = ({ className, children, ...props }) => (
  <div className={`toolbar ${className}`} {...props}>
    {children}
  </div>
);

Toolbar.defaultProps = {
  className: ''
};

export default Toolbar;
