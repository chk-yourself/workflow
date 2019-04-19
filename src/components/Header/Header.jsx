import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import { Navbar, NavLinksAuth, NavLinksNonAuth, Sidebar } from '../Nav';
import { SignOutButton } from '../SignOutButton';
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
      firebase,
      history: { location }
    } = this.props;
    const isLoginPage = location.pathname === '/login';
    const isSignUpPage = location.pathname === '/signup';
    return (
      <header
        className={`header ${isLoginPage ? 'header--login' : ''} ${
          isSignUpPage ? 'header--sign-up' : ''
        } ${isNavExpanded ? 'expand-nav' : ''}`}
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
                {!firebase.currentUser ? (
                  <NavLinksNonAuth />
                ) : <SignOutButton className="navbar__btn" />}
              </Navbar>
            )
          }
        </AuthUserContext.Consumer>
      </header>
    );
  }
}

export default compose(
  withRouter,
  withFirebase)
  (Header);
