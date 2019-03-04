import React, { Component } from 'react';
import { AuthUserContext } from '../Session';
import { Navbar, NavLinksAuth, NavLinksNonAuth, Sidebar } from '../Nav';
import { Avatar } from '../Avatar';
import { Topbar } from '../Topbar';
import './Header.scss';

export default class Header extends Component {
  state = {
    isNavExpanded: false
  };

  toggleNav = () => {
    this.setState(prevState => ({
      isNavExpanded: !prevState.isNavExpanded
    }));
  };

  handleClick = e => {
    this.setState(state => ({
      isNavExpanded: false
    }));
  };

  render() {
    const { isNavExpanded } = this.state;
    return (
      <header className={`header ${isNavExpanded ? 'expand-nav' : ''}`}>
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? (
              <>
                <Sidebar onToggle={this.toggleNav}>
                  <NavLinksAuth userId={authUser.uid} />
                </Sidebar>
                <Topbar />
              </>
            ) : (
              <Navbar>
                <NavLinksNonAuth />
              </Navbar>
            )
          }
        </AuthUserContext.Consumer>
      </header>
    );
  }
}
