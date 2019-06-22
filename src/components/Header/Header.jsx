import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { Navbar, NavLinksAuth, NavLinksNonAuth, Sidebar } from '../Nav';
import { SignOutButton } from '../SignOutButton';
import { Topbar } from '../Topbar';
import { WorkspaceComposer, WorkspaceSettings } from '../Workspace';
import { AccountSettings } from '../AccountSettings';
import * as ROUTES from '../../constants/routes';
import './Header.scss';

class Header extends Component {
  state = {
    isNavExpanded: false,
    isWorkspaceComposerActive: false,
    isWorkspaceSettingsActive: false,
    isAccountSettingsActive: false,
    isSticky: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this.stickNav);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.stickNav);
  }

  setRef = el => {
    this.header = el;
  };

  stickNav = e => {
    const {
      history: {
        location: { pathname }
      }
    } = this.props;
    if (!this.header || pathname !== '/') return;
    const { height } = this.header.getBoundingClientRect();
    const { isSticky } = this.state;
    if (window.scrollY >= height) {
      if (isSticky) return;
      this.setState({
        isSticky: true
      });
    } else {
      if (!isSticky) return;
      this.setState({
        isSticky: false
      });
    }
  };

  toggleNav = e => {
    this.setState(prevState => ({
      isNavExpanded: !prevState.isNavExpanded
    }));
  };

  collapseNav = () => {
    this.setState({
      isNavExpanded: false
    });
  };

  toggleWorkspaceComposer = () => {
    this.setState(prevState => ({
      isWorkspaceComposerActive: !prevState.isWorkspaceComposerActive
    }));
  };

  closeWorkspaceComposer = () => {
    this.setState({
      isWorkspaceComposerActive: false
    });
  };

  openWorkspaceSettings = () => {
    this.setState({
      isWorkspaceSettingsActive: true
    });
  };

  closeWorkspaceSettings = () => {
    this.setState({
      isWorkspaceSettingsActive: false
    });
  };

  toggleAccountSettings = () => {
    this.setState(prevState => ({
      isAccountSettingsActive: !prevState.isAccountSettingsActive
    }));
  };

  closeAccountSettings = () => {
    this.setState({
      isAccountSettingsActive: false
    });
  };

  render() {
    const {
      isNavExpanded,
      isWorkspaceComposerActive,
      isWorkspaceSettingsActive,
      isAccountSettingsActive,
      isSticky
    } = this.state;
    const {
      firebase,
      location: { pathname },
      currentUser,
      activeWorkspace
    } = this.props;
    const isLandingPage = pathname === ROUTES.LANDING;
    const isLoginPage = pathname === ROUTES.LOG_IN;
    const isSignUpPage = pathname === ROUTES.SIGN_UP;
    const isForgotPasswordPage = pathname === ROUTES.FORGOT_PASSWORD;
    return (
      <header
        ref={this.setRef}
        className={`header ${isLandingPage ? 'header--landing' : ''} ${
          isLoginPage ? 'header--login' : ''
        } ${isSignUpPage || isForgotPasswordPage ? 'header--dk' : ''} ${
          isNavExpanded ? 'expand-nav' : ''
        } ${isSticky ? 'is-sticky' : ''}`}
      >
        {currentUser && activeWorkspace ? (
          <>
            <Sidebar
              isExpanded={isNavExpanded}
              onToggle={this.toggleNav}
              onClose={this.collapseNav}
              isWorkspaceSettingsActive={isWorkspaceSettingsActive}
              openWorkspaceSettings={this.openWorkspaceSettings}
            >
              <NavLinksAuth onClick={this.collapseNav} userId={currentUser.userId} />
            </Sidebar>
            <Topbar
              openWorkspaceComposer={this.toggleWorkspaceComposer}
              openWorkspaceSettings={this.openWorkspaceSettings}
              openAccountSettings={this.toggleAccountSettings}
            />
            {isWorkspaceComposerActive && (
              <WorkspaceComposer onClose={this.closeWorkspaceComposer} />
            )}
            {isWorkspaceSettingsActive && (
              <WorkspaceSettings onClose={this.closeWorkspaceSettings} />
            )}
            {isAccountSettingsActive && <AccountSettings onClose={this.closeAccountSettings} />}
          </>
        ) : (
          <Navbar>
            {!firebase.currentUser ||
            pathname === ROUTES.LANDING ||
            pathname.includes(ROUTES.GUIDE) ? (
              <NavLinksNonAuth />
            ) : (
              <SignOutButton className="navbar__btn" />
            )}
          </Navbar>
        )}
      </header>
    );
  }
}

const condition = () => true;

export default withAuthorization(condition)(Header);
