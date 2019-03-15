import React from 'react';
import { Icon } from '../Icon';

const DashboardPanel = ({ name, icon, children, size }) => (
  <section className={`dashboard-panel dashboard-panel--${size}`}>
    <h2 className="dashboard-panel__header">
      <Icon name={icon} className="dashboard-panel__icon" />
      {name}
    </h2>
    <div className="dashboard-panel__content">
    {children}
    </div>
  </section>
);

DashboardPanel.defaultProps = {
  size: 'lg'
};

export default DashboardPanel;
