import React from 'react';
import { Icon } from '../Icon';
import { Button } from '../Button';
import './Modal.scss';

const Modal = ({
  onModalClose,
  children,
  onModalClick,
  size = 'md',
  classes,
  id
}) => {
  return (
    <div className={`modal ${classes.modal}`} onClick={onModalClick}>
      <div
        id={id}
        className={`modal__content ${classes.content} modal__content--${size}`}
      >
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

Modal.defaultProps = {
  classes: {
    modal: '',
    content: ''
  }
};

export default Modal;
