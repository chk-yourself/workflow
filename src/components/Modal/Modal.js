import React from 'react';
import { Icon } from '../Icon';
import { Button } from '../Button';
import './Modal.scss';

const Modal = ({
  onModalClose,
  children,
  className = '',
  onModalClick,
  size = 'md'
}) => {
  return (
    <div className="modal" onClick={onModalClick}>
      <div className={`modal__content ${className} modal__content--${size}`}>
        <Button
          type="button"
          className="modal__btn--close"
          onClick={onModalClose}
          iconOnly
        >
          <Icon name="x" />
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
