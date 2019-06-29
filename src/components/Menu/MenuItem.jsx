import React from 'react';
import './Menu.scss';

const MenuItem = ({ children, className, role, ...props }) => {
  return (
    <li className={`menu__item ${className}`} role={role} {...props}>
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
