import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '../Button';
import { withOutsideClick } from '../withOutsideClick';
import './Modal.scss';

class Modal extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    size: PropTypes.string,
    classes: PropTypes.objectOf(PropTypes.string)
  };

  static defaultProps = {
    onClick: () => null,
    onClose: () => null,
    size: 'md',
    classes: {
      modal: '',
      content: '',
      button: ''
    }
  };

  componentDidMount() {
    this.bodyOverflow = window.getComputedStyle(document.body).overflow; // store current value of body overflow
    document.body.style.overflow = 'hidden'; // locks body scroll
  }

  componentWillUnmount() {
    document.body.style.overflow = this.bodyOverflow; // reset body overflow to original value
  }

  onOutsideClick = e => {
    const { onOutsideClick, onClose } = this.props;
    if (onOutsideClick) {
      onOutsideClick(e);
    } else {
      onClose(e);
    }
  };

  render() {
    const { children, onClose, onClick, size, classes, id, innerRef } = this.props;
    return (
      <div
        className={`modal modal--${size} ${classes.modal || ''}`}
        onClick={onClick}
        role="dialog"
        aria-modal
        tabIndex="-1"
      >
        <div
          id={id}
          ref={innerRef}
          className={`modal__content ${classes.content || ''} modal__content--${size}`}
        >
          <IconButton
            type="button"
            className={`modal__btn--close ${classes.button || ''}`}
            onClick={onClose}
            icon="x"
            label="Close modal"
          />
          {children}
        </div>
      </div>
    );
  }
}

export default withOutsideClick(Modal);
