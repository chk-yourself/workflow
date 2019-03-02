import React, { Component } from 'react';
import { Logo } from '../Logo';
import { Icon } from '../Icon';
import { Button } from '../Button';
import './Sidebar.scss';

export const SidebarIcon = ({ name }) => {
  return <Icon name={name} className="sidebar__icon" />;
};

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onToggle, children } = this.props;
    return (
      <div className="sidebar__canvas">
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
