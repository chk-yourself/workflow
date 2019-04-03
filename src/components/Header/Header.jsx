import React, { Component } from 'react';
import { AuthUserContext } from '../Session';
import { Navbar, NavLinksAuth, NavLinksNonAuth, Sidebar } from '../Nav';
import { Topbar } from '../Topbar';
import './Header.scss';

export default class Header extends Component {
  state = {
    isNavExpanded: false
  };

  toggleNav = e => {
    this.setState(prevState => ({
      isNavExpanded: !prevState.isNavExpanded
    }));
  };

  render() {
    const { isNavExpanded } = this.state;
    return (
      <header className={`header ${isNavExpanded ? 'expand-nav' : ''}`}>
        <AuthUserContext.Consumer>
          {currentUser =>
            currentUser ? (
              <>
                <Sidebar isExpanded={isNavExpanded} onToggle={this.toggleNav}>
                  <NavLinksAuth
                    onClick={this.toggleNav}
                    userId={currentUser.userId}
                  />
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
