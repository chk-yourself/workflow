import React from 'react';

const Tablist = ({ className, children }) => (
  <ul role="tablist" className={`tablist ${className}`}>
    {children}
  </ul>
);

Tablist.defaultProps = {
  className: ''
};

export default Tablist;
