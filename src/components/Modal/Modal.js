import React, { Component } from 'react';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { withOutsideClick } from '../withOutsideClick';
import './Modal.scss';

class Modal extends Component {
  static defaultProps = {
    onModalClick: () => null,
    onOutsideClick: () => null
  }
  
  onOutsideClick = e => {
    const { onOutsideClick, onModalClose } = this.props;
    if (onOutsideClick) {
      onOutsideClick(e);
    } else {
      onModalClose(e);
    }
  };

  render() {
    const {
      onModalClose,
      children,
      onModalClick,
      size = 'md',
      classes,
      id,
      innerRef
    } = this.props;
    return (
      <div className={`modal ${classes.modal || ''}`} onClick={onModalClick}>
        <div
          id={id}
          ref={innerRef}
          className={`modal__content ${
            classes.content || ''
          } modal__content--${size}`}
        >
          <Button
            type="button"
            className={`modal__btn--close ${
            classes.button || ''
          }`}
            onClick={onModalClose}
            iconOnly
          >
            <Icon name="x" />
          </Button>
          {children}
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  classes: {
    modal: '',
    content: '',
    button: ''
  }
};

export default withOutsideClick(Modal);
