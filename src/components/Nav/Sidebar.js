import React, { Component } from 'react';
import { Logo } from '../Logo';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { withOutsideClick } from '../withOutsideClick';
import { Members } from '../Members';
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
    const { onToggle, children, innerRef } = this.props;
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
            <ul className="sidebar__list">
              {children}
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
                <Members isExpanded={isMembersListVisible} />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default withOutsideClick(Sidebar);
