import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { withOutsideClick } from '../withOutsideClick';
import { withAuthorization } from '../Session';
import { Members } from '../Members';
import { JamIcon } from '../JamIcon';
import * as ROUTES from '../../constants/routes';
import './Sidebar.scss';

export const SidebarIcon = ({ name }) => {
  return <Icon name={name} className="sidebar__icon" />;
};

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
        <Button
          type="button"
          onClick={onToggle}
          className="sidebar__btn--toggle"
          size="sm"
          iconOnly
        >
          <Icon name="bar-chart-2" />
        </Button>
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
                <Icon className="sidebar__icon" name="settings" />
                <span className="sidebar__section-name sidebar__workspace-name">
                  {workspaceName}
                </span>
              </Button>
              <ul className="sidebar__list sidebar__workspace-links">
                <li className="sidebar__item">
                  <Link
                    className="sidebar__link"
                    onClick={onToggle}
                    to={`/0/workspaces/${workspaceId}/projects`}
                  >
                    <Icon className="sidebar__icon" name="grid" />
                    <span className="sidebar__section-name">All Projects</span>
                  </Link>
                </li>
                <li className="sidebar__item sidebar__item--team">
                  <Button
                    isActive={isMembersListVisible}
                    className="sidebar__btn sidebar__btn--toggle-members"
                    onClick={this.toggleMembersList}
                  >
                    <Icon className="sidebar__icon" name="users" />
                    <span className="sidebar__section-name">Team</span>
                    <Icon className="sidebar__icon" name="chevron-left" />
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
                    <Link
                      target="_blank"
                      className="sidebar__link"
                      to={ROUTES.GUIDE}
                    >
                      <Icon className="sidebar__icon" name="help-circle" />
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

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default compose(
  withAuthorization(condition),
  withOutsideClick
)(Sidebar);
