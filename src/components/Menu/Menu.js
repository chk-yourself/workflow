import React from 'react';
import './Menu.scss';

const Menu = ({ children, onClick, className = '', menuRef }) => {
  return (
    <ul className={`menu ${className}`} onClick={onClick} ref={menuRef}>
      {children}
    </ul>
  );
};

export default Menu;
