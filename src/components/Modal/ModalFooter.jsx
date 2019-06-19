import React from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';

const ModalFooter = ({ children, align, className }) => {
  return (
    <div className={`modal__footer modal__footer--align-${align} ${className}`}>{children}</div>
  );
};

ModalFooter.defaultProps = {
  className: '',
  align: 'right'
};

ModalFooter.propTypes = {
  className: PropTypes.string,
  align: PropTypes.oneOf(['right', 'left', 'center'])
};

export default ModalFooter;
