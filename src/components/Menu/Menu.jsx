import React, { Component } from 'react';
import MenuItem from './MenuItem';
import './Menu.scss';

class Menu extends Component {
  static Item = MenuItem;

  render() {
    const { children, onClick, className, innerRef, role, ...rest } = this.props;
    return (
      <ul className={`menu ${className}`} onClick={onClick} ref={innerRef} role={role} {...rest}>
        {children}
      </ul>
    );
  }
}

Menu.defaultProps = {
  children: null,
  className: '',
  role: null
};

export default Menu;
