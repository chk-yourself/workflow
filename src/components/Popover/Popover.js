import React, { Component } from 'react';

export default class Popover extends Component {
  state = {
    isTouchEnabled: false
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  handleTouch = () => {
    this.setState({
      isTouchEnabled: true
    });
    // remove touch handler to prevent unnecessary refires
    document.removeEventListener('touchstart', this.handleTouch);
    // remove outside click handler from click events
    document.removeEventListener('click', this.handleOutsideClick);
    // reattach outside click handler to touchstart events
    document.addEventListener('touchstart', this.handleOutsideClick);
  };

  handleOutsideClick = e => {
    const { onOutsideClick } = this.props;
    onOutsideClick(e.target);
  };

  componentWillUnmount() {
    const { isTouchEnabled } = this.state;

    if (isTouchEnabled) {
      document.removeEventListener('touchstart', this.handleOutsideClick);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
      document.removeEventListener('touchstart', this.handleTouch);
    }
  }

  render() {
    const { className, onClick, style, children } = this.props;
    return (
      <div className={`popover ${className}`} onClick={onClick} style={style}>
        {children}
      </div>
    );
  }
}
