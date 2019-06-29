import React from 'react';
import { NavLink } from 'react-router-dom';
import SidebarIcon from './SidebarIcon';

const SidebarItem = ({ onClick, icon, children, link }) => {
  return (
    <li className="sidebar__item">
      <NavLink onClick={onClick} className="sidebar__link" to={link}>
        <SidebarIcon name={icon} />
        <span className="sidebar__section-name">{children}</span>
      </NavLink>
    </li>
  );
};

export default SidebarItem;
