import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { Navbar, NavLinksAuth, NavLinksNonAuth, Sidebar } from '../Nav';
import { SignOutButton } from '../SignOutButton';
import { Topbar } from '../Topbar';
import { WorkspaceComposer, WorkspaceSettings } from '../Workspace';
import * as ROUTES from '../../constants/routes';
import './Header.scss';

class Header extends Component {
  state = {
    isNavExpanded: false,
    isWorkspaceComposerActive: false,
    isWorkspaceSettingsActive: false,
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

  collapseNav = e => {
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

  toggleWorkspaceSettings = () => {
    this.setState(prevState => ({
      isWorkspaceSettingsActive: !prevState.isWorkspaceSettingsActive
    }));
  };

  openWorkspaceSettings = () => {
    const { isWorkspaceSettingsActive } = this.state;
    if (isWorkspaceSettingsActive) return;
    this.toggleWorkspaceSettings();
  };

  closeWorkspaceSettings = () => {
    this.setState({
      isWorkspaceSettingsActive: false
    });
  };

  render() {
    const {
      isNavExpanded,
      isWorkspaceComposerActive,
      isWorkspaceSettingsActive,
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
              isWorkspaceSettingsActive={isWorkspaceSettingsActive}
              openWorkspaceSettings={this.openWorkspaceSettings}
            >
              <NavLinksAuth
                onClick={this.collapseNav}
                userId={currentUser.userId}
              />
            </Sidebar>
            <Topbar
              openWorkspaceComposer={this.toggleWorkspaceComposer}
              openWorkspaceSettings={this.openWorkspaceSettings}
            />
            {isWorkspaceComposerActive && (
              <WorkspaceComposer onClose={this.closeWorkspaceComposer} />
            )}
            {isWorkspaceSettingsActive && (
              <WorkspaceSettings onClose={this.closeWorkspaceSettings} />
            )}
          </>
        ) : (
          <Navbar>
            {!firebase.currentUser || pathname === ROUTES.LANDING || pathname.includes(ROUTES.GUIDE) ? (
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
