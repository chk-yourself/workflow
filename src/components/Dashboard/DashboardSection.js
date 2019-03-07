import React from 'react';
import { Icon } from '../Icon';

const DashboardSection = ({ title, icon, children, size }) => (
  <section className={`dashboard__section dashboard__section--${size}`}>
    <h2 className="dashboard__section-header">
      <Icon name={icon} className="dashboard__section-icon" />
      {title}
    </h2>
    {children}
  </section>
);

DashboardSection.defaultProps = {
  size: 'lg'
};

export default DashboardSection;
