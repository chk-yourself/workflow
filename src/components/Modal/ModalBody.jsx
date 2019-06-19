import React from 'react';

const ModalBody = ({ children, className }) => {
  return <div className={`modal__body ${className}`}>{children}</div>;
};

ModalBody.defaultProps = {
  className: ''
};

export default ModalBody;
