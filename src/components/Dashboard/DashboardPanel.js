import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';

const DashboardPanel = ({ name, icon, children, size, link }) => (
  <section className={`dashboard-panel dashboard-panel--${size}`}>
    <header className="dashboard-panel__header">
      <h2 className="dashboard-panel__name">
        <Icon name={icon} className="dashboard-panel__icon" />
        {name}
      </h2>
      {link && (
        <Link to={link.path} className="dashboard-panel__link">
          {link.text}
        </Link>
      )}
    </header>
    <div className="dashboard-panel__content">{children}</div>
  </section>
);

DashboardPanel.defaultProps = {
  size: 'lg',
  link: null
};

export default DashboardPanel;
