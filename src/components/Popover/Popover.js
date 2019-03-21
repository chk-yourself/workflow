import React, { Component } from 'react';

export default class Popover extends Component {

  render() {
    const { className, onClick, style, children, isVisible } = this.props;
    return (
      <div className={`popover ${className}`} onClick={onClick} style={{...style, display: isVisible ? 'block' : 'none'}}>
        {children}
      </div>
    );
  }
}
