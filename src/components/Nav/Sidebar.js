import React, { Component } from 'react';
import { Logo } from '../Logo';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { withOutsideClick } from '../withOutsideClick';
import './Sidebar.scss';

export const SidebarIcon = ({ name }) => {
  return <Icon name={name} className="sidebar__icon" />;
};

class Sidebar extends Component {
  onOutsideClick = e => {
    const { isExpanded } = this.props;
    if (!isExpanded || e.target.matches('.sidebar__btn--toggle')) return;
    const { onToggle } = this.props;
    onToggle();
  };

  render() {
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
            <ul className="sidebar__list">{children}</ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default withOutsideClick(Sidebar);
