import React from 'react';
import { Icon } from '../Icon';

const DashboardSection = ({ title, icon, children }) => (
  <section className="dashboard__section">
    <h2 className="dashboard__section-header">
      <Icon name={icon} className="dashboard__section-icon" />
      {title}
    </h2>
    {children}
  </section>
);

export default DashboardSection;
