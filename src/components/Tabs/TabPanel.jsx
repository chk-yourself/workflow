import React from 'react';

const TabPanel = ({ className, id, tabId, children, isActive }) => (
  <section
    className={`tab-panel ${className}`}
    id={id}
    role="tabpanel"
    aria-labelledby={tabId}
    aria-hidden={!isActive}
    style={{ display: isActive ? 'block' : 'none' }}
  >
    {children}
  </section>
);

TabPanel.defaultProps = {
  className: ''
};

export default TabPanel;
