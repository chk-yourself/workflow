import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { Navbar, NavLinksAuth, NavLinksNonAuth, Sidebar } from '../Nav';
import { Topbar } from '../Topbar';
import './Header.scss';

class Header extends Component {
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
    const {
      history: { location }
    } = this.props;
    const isLoginPage = location.pathname === '/login';
    return (
      <header
        className={`header ${isLoginPage ? 'header--login' : ''} ${
          isNavExpanded ? 'expand-nav' : ''
        }`}
      >
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

export default withRouter(Header);
