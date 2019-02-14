import React from 'react';
import './Menu.scss';

const MenuItem = ({ children, className = '' }) => {
  return <li className={`menu__item ${className}`}>{children}</li>;
};

export default MenuItem;
