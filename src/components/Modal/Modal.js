import React from 'react';
import { Icon } from '../Icon';
import './Modal.scss';

const Modal = ({ onModalClose, children, className, onModalClick }) => {
  return (
    <div className="modal" onClick={onModalClick}>
      <div className={`modal__content ${className}`}>
        <button
          type="button"
          className="modal__btn--close"
          onClick={onModalClose}
        >
          <Icon name="x" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
