import React from 'react';
import './Menu.scss';

const MenuItem = ({ children, className, role }) => {
  return (
    <li className={`menu__item ${className}`} role={role}>
      {children}
    </li>
  );
};

MenuItem.defaultProps = {
  className: '',
  children: null,
  role: null
};

export default MenuItem;
