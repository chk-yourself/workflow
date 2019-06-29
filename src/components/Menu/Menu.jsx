import React from 'react';
import './Menu.scss';

const Menu = ({ children, onClick, className, innerRef, role, ...props }) => {
  return (
    <ul
      className={`menu ${className}`}
      onClick={onClick}
      ref={innerRef}
      role={role}
      {...props}
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
