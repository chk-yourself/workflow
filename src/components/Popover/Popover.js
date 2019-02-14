import React, { Component } from 'react';

export default class Popover extends Component {
  componentDidMount() {
    document.body.addEventListener('click', this.handleOutsideClick, false);
  }

  handleOutsideClick = e => {
    const { onOutsideClick } = this.props;
    onOutsideClick(e);
    document.body.removeEventListener('click', this.handleOutsideClick);
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
