import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { Navbar, NavLinksAuth, NavLinksNonAuth, Sidebar } from '../Nav';
import { SignOutButton } from '../SignOutButton';
import { Topbar } from '../Topbar';
import { WorkspaceComposer, WorkspaceSettings } from '../Workspace';
import './Header.scss';

class Header extends Component {
  state = {
    isNavExpanded: false,
    isWorkspaceComposerActive: false,
    isWorkspaceSettingsActive: false
  };

  toggleNav = e => {
    this.setState(prevState => ({
      isNavExpanded: !prevState.isNavExpanded
    }));
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
      isWorkspaceSettingsActive
    } = this.state;
    const {
      firebase,
      history: { location },
      currentUser,
      activeWorkspace
    } = this.props;
    const isLoginPage = location.pathname === '/login';
    const isSignUpPage = location.pathname === '/signup';
    return (
      <header
        className={`header ${isLoginPage ? 'header--login' : ''} ${
          isSignUpPage ? 'header--sign-up' : ''
        } ${isNavExpanded ? 'expand-nav' : ''}`}
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
                onClick={this.toggleNav}
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
            {!firebase.currentUser ? (
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
