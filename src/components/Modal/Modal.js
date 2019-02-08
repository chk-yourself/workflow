import React from 'react';
import { FeatherIcon } from '../FeatherIcon';
import './Modal.scss';

const Modal = ({ onModalClose, children }) => {
  return (
    <div className="modal">
      <div className="modal__content">
        <button
          type="button"
          className="modal__btn--close"
          onClick={onModalClose}
        >
          <FeatherIcon name="x" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
