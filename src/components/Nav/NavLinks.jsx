import React from 'react';
import { NavLink } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { SidebarItem } from '../Sidebar';

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
    <SidebarItem onClick={onClick} icon="home" link={`/0/home/${userId}`}>
      Home
    </SidebarItem>
    <SidebarItem onClick={onClick} icon="bell" link={`/0/inbox/${userId}`}>
      Inbox
    </SidebarItem>
    <SidebarItem onClick={onClick} icon="check-circle" link={`/0/${userId}/tasks`}>
      My Tasks
    </SidebarItem>
  </>
);
