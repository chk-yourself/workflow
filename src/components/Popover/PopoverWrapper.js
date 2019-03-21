import React, { Component } from 'react';
import { Button } from '../Button';
import Popover from './Popover';
import { withOutsideClick } from '../withOutsideClick';
import './Popover.scss';

class PopoverWrapper extends Component {
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
    const { onOutsideClick, onPopoverClose } = this.props;

    if (onOutsideClick) {
      onOutsideClick(e);
    } else {

      this.setState({
        isActive: false
      });

      if (onPopoverClose) {
        onPopoverClose(e);
      }
    }
  };

  toggleOpen = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }));
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
      align,
      onWrapperClick,
      buttonProps,
      classes,
      anchorEl,
      innerRef
    } = this.props;
    const isActive =
      'isActive' in this.props ? this.props.isActive : this.state.isActive;

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
        className={`popover-wrapper ${isActive ? 'is-active' : ''} ${
          classes.wrapper
        }`}
        ref={innerRef}
        style={popoverWrapperStyle}
        onClick={onWrapperClick}
      >
        <Button
          type="button"
          onClick={this.toggleOpen}
          buttonRef={this.props.buttonRef}
          {...buttonProps}
        />
          <Popover
            isVisible={isActive}
            className={`align-${align.inner || 'left'} ${classes.popover}`}
            onClick={this.handleClose}
          >
            {children}
          </Popover>
      </div>
    );
  }
}

export default withOutsideClick(PopoverWrapper);