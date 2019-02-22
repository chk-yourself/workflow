import React, { Component } from 'react';
import { Button } from '../Button';
import Popover from './Popover';
import './Popover.scss';

export default class PopoverWrapper extends Component {
  state = {
    isOpen: false
  };

  static defaultProps = {
    wrapperClass: '',
    popoverClass: '',
    buttonProps: {},
    align: 'left',
    anchorEl: null
  };

  handleOutsideClick = target => {
    if (this.componentEl && !this.componentEl.contains(target)) {
      this.setState({
        isOpen: false
      });
    }
  };

  toggleOpen = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  handleClose = e => {
    if (e.target.matches('input')) return;
    this.setState(prevState => ({
      isOpen: false
    }));
  };

  render() {
    const {
      children,
      alignInner,
      alignOuter,
      buttonProps,
      wrapperClass,
      popoverClass,
      anchorEl
    } = this.props;
    const { isOpen } = this.state;

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
        className={`popover-wrapper ${
          isOpen ? 'is-active' : ''
        } ${wrapperClass}`}
        ref={el => (this.componentEl = el)}
        style={popoverWrapperStyle}
      >
        <Button
          type="button"
          onClick={this.toggleOpen}
          buttonRef={this.props.buttonRef}
          {...buttonProps}
        />
        {isOpen && (
          <Popover
            className={`align-${alignInner} ${popoverClass}`}
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
