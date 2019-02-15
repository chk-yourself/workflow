import React, { Component } from 'react';

export default class Popover extends Component {
  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick, false);
  }

  handleOutsideClick = e => {
    const { onOutsideClick } = this.props;
    onOutsideClick(e);
    console.log('click');
    window.removeEventListener('click', this.handleOutsideClick);
  };

  render() {
    const { className, onClick, style, children } = this.props;
    return (
      <div className={`popover ${className}`} onClick={onClick} style={style}>
        {children}
      </div>
    );
  }
}
