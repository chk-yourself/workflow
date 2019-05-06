import React from 'react';
import { NavLink } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { SidebarIcon } from './Sidebar';

export const NavLinksNonAuth = ({ onClick }) => (
  <>
    <li>
      <NavLink className="navbar__link" onClick={onClick} to={ROUTES.LOG_IN}>
        Log In
      </NavLink>
    </li>
    <li>
      <NavLink className="navbar__link" onClick={onClick} to={ROUTES.SIGN_UP}>
        Sign Up
      </NavLink>
    </li>
    <li>
      <NavLink className="navbar__link" to={ROUTES.GUIDE}>
        Guide
      </NavLink>
    </li>
  </>
);

export const NavLinksAuth = ({ userId, onClick }) => (
  <>
    <li className="sidebar__item">
      <NavLink
        onClick={onClick}
        className="sidebar__link"
        to={`/0/home/${userId}`}
      >
        <SidebarIcon name="home" />
        <span className="sidebar__section-name">Home</span>
      </NavLink>
    </li>
    <li className="sidebar__item">
      <NavLink
        onClick={onClick}
        className="sidebar__link"
        to={`/0/inbox/${userId}`}
      >
        <SidebarIcon name="bell" />
        <span className="sidebar__section-name">Inbox</span>
      </NavLink>
    </li>
    <li className="sidebar__item">
      <NavLink
        onClick={onClick}
        className="sidebar__link"
        to={`/0/${userId}/tasks`}
      >
        <SidebarIcon name="check-circle" />
        <span className="sidebar__section-name">My Tasks</span>
      </NavLink>
    </li>
    <li className="sidebar__item">
      <NavLink
        onClick={onClick}
        className="sidebar__link"
        to={`/0/${userId}/projects`}
      >
        <SidebarIcon name="grid" />
        <span className="sidebar__section-name">My Projects</span>
      </NavLink>
    </li>
  </>
);
