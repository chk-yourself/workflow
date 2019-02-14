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
    align: 'left'
  };

  handleOutsideClick = e => {
    if (!this.componentEl.contains(e.target)) {
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

  render() {
    const {
      children,
      align,
      buttonProps,
      wrapperClass,
      popoverClass
    } = this.props;
    const { isOpen } = this.state;
    let popoverStyle = null;

    if (this.anchorEl) {
      const { height } = this.anchorEl.getBoundingClientRect();

      popoverStyle = {
        top: height,
        left: align === 'left' ? 0 : 'auto',
        right: align === 'right' ? 0 : 'auto'
      };
    }

    return (
      <div
        className={`popover-wrapper ${wrapperClass}`}
        ref={el => (this.componentEl = el)}
      >
        <Button
          type="button"
          onClick={this.toggleOpen}
          buttonRef={el => (this.anchorEl = el)}
          {...buttonProps}
        />
        {isOpen && (
          <Popover
            className={popoverClass}
            onClick={this.toggleOpen}
            style={popoverStyle}
            onOutsideClick={this.handleOutsideClick}
            key="popover"
          >
            {children}
          </Popover>
        )}
      </div>
    );
  }
}
