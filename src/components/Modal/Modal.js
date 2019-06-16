import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { withOutsideClick } from '../withOutsideClick';
import './Modal.scss';

class Modal extends Component {
  static propTypes = {
    onModalClick: PropTypes.func,
    onModalClose: PropTypes.func,
    size: PropTypes.string,
    classes: PropTypes.objectOf(PropTypes.string)
  };

  static defaultProps = {
    onModalClick: () => null,
    onModalClose: () => null,
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
    const { onOutsideClick, onModalClose } = this.props;
    if (onOutsideClick) {
      onOutsideClick(e);
    } else {
      onModalClose(e);
    }
  };

  render() {
    const {
      children,
      onModalClose,
      onModalClick,
      size,
      classes,
      id,
      innerRef
    } = this.props;
    return (
      <div
        className={`modal modal--${size} ${classes.modal || ''}`}
        onClick={onModalClick}
        role="dialog"
        aria-modal
        tabIndex="-1"
      >
        <div
          id={id}
          ref={innerRef}
          className={`modal__content ${classes.content ||
            ''} modal__content--${size}`}
        >
          <Button
            type="button"
            className={`modal__btn--close ${classes.button || ''}`}
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

export default withOutsideClick(Modal);
