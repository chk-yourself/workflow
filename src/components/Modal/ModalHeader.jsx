import React from 'react';

const ModalHeader = ({ className, children }) => {
  return <div className={`modal__header ${className}`}>{children}</div>;
};

ModalHeader.defaultProps = {
  className: ''
};

export default ModalHeader;
