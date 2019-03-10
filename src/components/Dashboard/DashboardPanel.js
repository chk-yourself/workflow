import React from 'react';
import { Icon } from '../Icon';

const DashboardPanel = ({ name, icon, children, size }) => (
  <section className={`dashboard__section dashboard__section--${size}`}>
    <h2 className="dashboard__section-header">
      <Icon name={icon} className="dashboard__section-icon" />
      {name}
    </h2>
    {children}
  </section>
);

DashboardPanel.defaultProps = {
  size: 'lg'
};

export default DashboardPanel;
