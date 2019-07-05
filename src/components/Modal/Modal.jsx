import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '../Button';
import { withOutsideClick } from '../withOutsideClick';
import { lockBodyScroll } from '../../utils/dom';
import './Modal.scss';

class Modal extends Component {
  static defaultProps = {
    onClick: () => null,
    onClose: () => null,
    size: 'md',
    classes: {
      modal: '',
      content: '',
      button: ''
    },
    disableBodyScroll: true,
    hasClose: true,
    focusCloseOnMount: true
  };

  static propTypes = {
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    size: PropTypes.string,
    classes: PropTypes.objectOf(PropTypes.string),
    disableBodyScroll: PropTypes.bool,
    // If true, close button will be included
    hasClose: PropTypes.bool,
    // If true, close button will receive focus on mount
    focusCloseOnMount: PropTypes.bool
  };

  componentDidMount() {
    const { disableBodyScroll, focusCloseOnMount } = this.props;
    if (disableBodyScroll) {
      this.unlockBodyScroll = lockBodyScroll();
    }
    if (focusCloseOnMount) {
      this.setFocusToClose();
    }
  }

  componentWillUnmount() {
    if (this.unlockBodyScroll) {
      this.unlockBodyScroll();
    }
  }

  setFocusToClose = () => {
    if (!this.close) return;
    this.close.focus();
  };

  onOutsideClick = e => {
    const { onOutsideClick, onClose } = this.props;
    if (onOutsideClick) {
      onOutsideClick(e);
    } else {
      onClose(e);
    }
  };

  setCloseRef = el => {
    this.close = el;
  };

  render() {
    const {
      children,
      onClose,
      onClick,
      size,
      classes,
      id,
      innerRef,
      onOutsideClick,
      disableBodyScroll,
      hasClose,
      focusCloseOnMount,
      ...rest
    } = this.props;
    return (
      <div
        className={`modal modal--${size} ${classes.modal || ''}`}
        onClick={onClick}
        role="dialog"
        aria-modal
        tabIndex="-1"
        {...rest}
      >
        <div
          id={id}
          ref={innerRef}
          className={`modal__content ${classes.content || ''} modal__content--${size}`}
        >
          {hasClose && (
            <IconButton
              type="button"
              className={`modal__btn--close ${classes.button || ''}`}
              onClick={onClose}
              icon="x"
              ariaLabel="Close modal"
              innerRef={this.setCloseRef}
            />
          )}
          {children}
        </div>
      </div>
    );
  }
}

export default withOutsideClick(Modal);
