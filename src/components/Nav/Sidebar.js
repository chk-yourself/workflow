import React, { Component } from 'react';
import { compose } from 'recompose';
import { Logo } from '../Logo';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { withOutsideClick } from '../withOutsideClick';
import { withAuthorization } from '../Session';
import { Members } from '../Members';
import { JamIcon } from '../JamIcon';
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
      innerRef
    } = this.props;
    const { name: workspaceName } = activeWorkspace;
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
              <Logo size="sm" />
            </div>
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
              <li className="sidebar__item sidebar__item--team">
                <Button
                  isActive={isMembersListVisible}
                  className="sidebar__btn"
                  onClick={this.toggleMembersList}
                >
                  <Icon className="sidebar__icon" name="users" />
                  <span className="sidebar__section-name">Team</span>
                  <Icon className="sidebar__icon" name="chevron-left" />
                </Button>
                <Members
                  style={{ display: isMembersListVisible ? 'block' : 'none' }}
                  classes={{
                    list: 'sidebar__list',
                    item: 'sidebar__item sidebar__member'
                  }}
                  showOnlineStatus
                  details={['name']}
                />
              </li>
            </ul>
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
