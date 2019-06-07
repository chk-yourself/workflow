import React from 'react';
import './Menu.scss';

const MenuItem = ({ children, className }) => {
  return <li className={`menu__item ${className}`}>{children}</li>;
};

MenuItem.defaultProps = {
  className: '',
  children: null
};

export default MenuItem;
