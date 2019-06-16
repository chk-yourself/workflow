import React from 'react';
import './Menu.scss';

const Menu = ({ children, onClick, className, innerRef, role }) => {
  return (
    <ul
      className={`menu ${className}`}
      onClick={onClick}
      ref={innerRef}
      role={role}
    >
      {children}
    </ul>
  );
};

Menu.defaultProps = {
  children: null,
  className: '',
  role: null
};

export default Menu;
