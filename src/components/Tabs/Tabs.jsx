import React from 'react';

const Tabs = ({ className, children }) => (
  <ul role="tablist" className={`tabs ${className}`}>
    {children}
  </ul>
);

Tabs.defaultProps = {
  className: ''
};

export default Tabs;
