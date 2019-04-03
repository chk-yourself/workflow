import React from 'react';

const Highlight = ({ className, children, style }) => (
  <span style={style} className={`highlight ${className}`}>
    {children}
  </span>
);

Highlight.defaultProps = {
  className: '',
  style: {
    fontWeight: 700
  }
};

export default Highlight;
