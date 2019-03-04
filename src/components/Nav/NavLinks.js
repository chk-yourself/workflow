import React from 'react';
import { NavLink } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { SidebarIcon } from './Sidebar';

export const NavLinksNonAuth = () => (
  <>
    <li>
      <NavLink to={ROUTES.SIGN_IN}>Log In</NavLink>
    </li>
    <li>
      <NavLink to={ROUTES.SIGN_UP}>Get Started</NavLink>
    </li>
  </>
);

export const NavLinksAuth = ({ userId }) => (
  <>
    <li className="sidebar__item">
      <NavLink className="sidebar__link" to={`/0/home/${userId}`}>
        <SidebarIcon name="home" />
        <span className="sidebar__section-name">Home</span>
      </NavLink>
    </li>
    <li className="sidebar__item">
      <NavLink className="sidebar__link" to={`/0/${userId}/projects`}>
        <SidebarIcon name="grid" />
        <span className="sidebar__section-name">Projects</span>
      </NavLink>
    </li>
    <li className="sidebar__item">
      <NavLink className="sidebar__link" to={`/0/${userId}/tasks`}>
        <SidebarIcon name="check-square" />
        <span className="sidebar__section-name">Tasks</span>
      </NavLink>
    </li>
    <li className="sidebar__item">
      <NavLink className="sidebar__link" to={ROUTES.ADMIN}>
        <SidebarIcon name="settings" />
        <span className="sidebar__section-name">Admin</span>
      </NavLink>
    </li>
  </>
);
