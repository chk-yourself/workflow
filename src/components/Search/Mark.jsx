import React from 'react';

const Mark = ({ className, children, style }) => (
  <mark style={style} className={`mark ${className}`}>
    {children}
  </mark>
);

Mark.defaultProps = {
  className: '',
  style: {
    fontWeight: 700
  }
};

export default Mark;
