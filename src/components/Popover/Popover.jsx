import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    anchorEl: null, // an element outside the Popover that may be used to position it
    target: null // rendered inside Popover component, in place of default button
  };

  static propTypes = {
    classes: PropTypes.shape({
      wrapper: PropTypes.string,
      popover: PropTypes.string
    }),
    buttonProps: PropTypes.objectOf(PropTypes.any),
    align: PropTypes.shape({
      outer: PropTypes.oneOf(['right', 'left']),
      inner: PropTypes.oneOf(['right', 'left'])
    }),
    anchorEl: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
    target: PropTypes.oneOfType([() => null, PropTypes.node, PropTypes.element])
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
    const {
      children,
      align,
      onWrapperClick,
      buttonProps,
      classes,
      anchorEl,
      target
    } = this.props;
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
      {target || (
        <Button innerRef={this.setButtonRef} onClick={this.toggleOpen} {...buttonProps} />
      )}
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
