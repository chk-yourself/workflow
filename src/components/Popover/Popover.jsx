import React, { Component } from 'react';
import { Button } from '../Button';
import PopoverContent from './PopoverContent';
import './Popover.scss';

class Popover extends Component {
  state = {
    isActive: 'isActive' in this.props ? null : false
  };

  static defaultProps = {
    classes: {
      wrapper: '',
      popover: ''
    },
    buttonProps: {},
    align: {
      outer: 'left',
      inner: 'left'
    },
    anchorEl: null
  };

  onOutsideClick = e => {
    const { onOutsideClick, onClose } = this.props;
    if (this.buttonRef && e.target === this.buttonRef) return;

    if (onOutsideClick) {
      onOutsideClick(e);
    } else {
      this.setState({
        isActive: false
      });

      if (onClose) {
        onClose(e);
      }
    }
  };

  toggleOpen = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }));
  };

  handleClose = e => {
    if ('isActive' in this.props) {
      const { onClose } = this.props;
      if (onClose) {
        // Ensures event handlers on children are fired before invoking `onClose` method
        setTimeout(() => {
          onClose(e);
        }, 0);
      }
    } else {
      //if (e.target.matches('input')) return;
      this.setState({
        isActive: false
      });
    }
  };

  setButtonRef = el => {
    this.buttonRef = el;
  };

  render() {
    const { children, align, onWrapperClick, buttonProps, classes, anchorEl } = this.props;
    const isActive = 'isActive' in this.props ? this.props.isActive : this.state.isActive;

    let popoverWrapperStyle = null;

    if (anchorEl) {
      const { offsetTop, offsetLeft } = anchorEl;
      popoverWrapperStyle = {
        position: 'absolute',
        top: offsetTop,
        [align.outer || 'left']: offsetLeft
      };
    }

    return (
      <div
        className={`popover-wrapper ${isActive ? 'is-active' : ''} ${classes.wrapper}`}
        style={popoverWrapperStyle}
        onClick={onWrapperClick}
      >
        <Button
          innerRef={this.setButtonRef}
          type="button"
          onClick={this.toggleOpen}
          {...buttonProps}
        />
        {isActive && (
          <PopoverContent
            onOutsideClick={this.onOutsideClick}
            isVisible={isActive}
            className={`align-${align.inner || 'left'} ${classes.popover}`}
            onClick={this.handleClose}
          >
            {children}
          </PopoverContent>
        )}
      </div>
    );
  }
}

export default Popover;
