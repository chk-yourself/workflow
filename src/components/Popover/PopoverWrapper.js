import React, { Component } from 'react';
import { Button } from '../Button';
import Popover from './Popover';
import './Popover.scss';

export default class PopoverWrapper extends Component {
  state = {
    isActive: 'isActive' in this.props ? null : false
  };

  static defaultProps = {
    classes: {
      wrapper: '',
      popover: ''
    },
    buttonProps: {},
    align: 'left',
    anchorEl: null
  };

  handleOutsideClick = target => {
    if (this.componentEl && this.componentEl.contains(target)) return;
    const { onOutsideClick, onPopoverClose } = this.props;

    if (onOutsideClick) {
      onOutsideClick();
    } else {
      this.setState({
        isActive: false
      });
  
      if (onPopoverClose) {
        onPopoverClose();
      }
    }
  };

  toggleOpen = () => {
    const { onButtonClick } = this.props;

    if (onButtonClick) {
      onButtonClick();
    } else {
      this.setState(prevState => ({
        isActive: !prevState.isActive
      }));
    }
  };

  handleClose = e => {
    if ('isActive' in this.props) return;
    if (e.target.matches('input')) return;
    this.setState({
      isActive: false
    });
  };

  render() {
    const {
      children,
      alignInner,
      onWrapperClick,
      alignOuter,
      buttonProps,
      classes,
      anchorEl
    } = this.props;
    const isActive = 'isActive' in this.props ? this.props.isActive : this.state.isActive;

    let popoverWrapperStyle = null;

    if (anchorEl) {
      const { offsetTop, offsetLeft } = anchorEl;
      popoverWrapperStyle = {
        position: 'absolute',
        top: offsetTop,
        [alignOuter]: offsetLeft
      };
    }

    return (
      <div
        className={`popover-wrapper ${isActive ? 'is-active' : ''} ${
          classes.wrapper
        }`}
        ref={el => (this.componentEl = el)}
        style={popoverWrapperStyle}
        onClick={onWrapperClick}
      >
        <Button
          type="button"
          onClick={this.toggleOpen}
          buttonRef={this.props.buttonRef}
          {...buttonProps}
        />
        {isActive && (
          <Popover
            className={`align-${alignInner} ${classes.popover}`}
            onClick={this.handleClose}
            onOutsideClick={this.handleOutsideClick}
          >
            {children}
          </Popover>
        )}
      </div>
    );
  }
}
