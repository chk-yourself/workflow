import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPanel = ({ className, name, children, size, link }) => (
  <section className={`dashboard-panel ${className ? `dashboard-panel--${className}` : ''} dashboard-panel--${size}`}>
    <header className="dashboard-panel__header">
      <h2 className="dashboard-panel__name">
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
  link: null,
  className: ''
};

export default DashboardPanel;
