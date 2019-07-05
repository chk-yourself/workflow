import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { Button, IconButton } from '../Button';
import { withOutsideClick } from '../withOutsideClick';
import { withAuthorization } from '../Session';
import { Members } from '../Members';
import { GUIDE } from '../../constants/routes';
import './Sidebar.scss';
import SidebarIcon from './SidebarIcon';
import SidebarItem from './SidebarItem';

class Sidebar extends Component {
  state = {
    isMembersListVisible: false
  };

  onOutsideClick = e => {
    const { isExpanded } = this.props;
    if (!isExpanded || e.target.matches('.sidebar__btn--toggle')) return;
    const { onToggle } = this.props;
    onToggle();
  };

  toggleMembersList = () => {
    this.setState(prevState => ({
      isMembersListVisible: !prevState.isMembersListVisible
    }));
  };

  render() {
    const { isMembersListVisible } = this.state;
    const {
      onToggle,
      onClose,
      children,
      activeWorkspace,
      openWorkspaceSettings,
      isWorkspaceSettingsActive,
      innerRef,
      currentUser
    } = this.props;
    const { userId } = currentUser;
    const { name: workspaceName, workspaceId } = activeWorkspace;
    return (
      <div ref={innerRef} className="sidebar__canvas">
        <IconButton
          onClick={onToggle}
          className="sidebar__btn--toggle"
          size="sm"
          icon="bar-chart-2"
          ariaLabel="Toggle menu"
        />
        <div className="sidebar">
          <nav className="sidebar__nav">
            <div className="sidebar__logo">
              <Logo link={`/0/home/${userId}`} size="sm" />
            </div>
            <div className="sidebar__content">
              <ul className="sidebar__list">{children}</ul>
              <Button
                isActive={isWorkspaceSettingsActive}
                className="sidebar__btn sidebar__btn--workspace-settings"
                onClick={openWorkspaceSettings}
              >
                <SidebarIcon name="settings" />
                <span className="sidebar__section-name sidebar__workspace-name">
                  {workspaceName}
                </span>
              </Button>
              <ul className="sidebar__list sidebar__workspace-links">
                <SidebarItem
                  onClick={onClose}
                  icon="grid"
                  link={`/0/${workspaceId}/projects`}
                >
                  Projects
                </SidebarItem>
                <li className="sidebar__item sidebar__item--team">
                  <Button
                    isActive={isMembersListVisible}
                    className="sidebar__btn sidebar__btn--toggle-members"
                    onClick={this.toggleMembersList}
                  >
                    <SidebarIcon name="users" />
                    <span className="sidebar__section-name">Team</span>
                    <SidebarIcon name="chevron-left" />
                  </Button>
                  <Members
                    style={{ display: isMembersListVisible ? 'block' : 'none' }}
                    classes={{
                      list: 'sidebar__list sidebar__members-list',
                      item: 'sidebar__item sidebar__member',
                      detail: 'sidebar__member-detail',
                      avatar: 'sidebar__avatar'
                    }}
                    showOnlineStatus
                    details={['name', 'displayName']}
                  />
                </li>
                <ul className="sidebar__list">
                  <li className="sidebar__item">
                    <Link target="_blank" className="sidebar__link" to={GUIDE}>
                      <SidebarIcon name="help-circle" />
                      <span className="sidebar__section-name">Guide</span>
                    </Link>
                  </li>
                </ul>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default compose(
  withAuthorization(condition),
  withOutsideClick
)(Sidebar);
