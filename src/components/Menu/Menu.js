import React from 'react';
import './Menu.scss';

const Menu = ({ children, onClick, className, innerRef }) => {
  return (
    <ul className={`menu ${className}`} onClick={onClick} ref={innerRef}>
      {children}
    </ul>
  );
};

Menu.defaultProps = {
  children: null,
  className: ''
};

export default Menu;
