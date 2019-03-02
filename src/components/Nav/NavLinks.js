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

export const NavLinksAuth = () => (
  <>
    <li className="sidebar__item">
      <NavLink className="sidebar__link" to={ROUTES.HOME}>
        <SidebarIcon name="home" />
        <span className="sidebar__section-name">Home</span>
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
