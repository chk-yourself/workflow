import React from 'react';
import './Menu.scss';

const Menu = ({ children, onClick, className = '' }) => {
  return <ul className={`menu ${className}`} onClick={onClick}>{children}</ul>;
};

export default Menu;
