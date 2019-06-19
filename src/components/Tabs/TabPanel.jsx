import React from 'react';
import PropTypes from 'prop-types';

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
  className: '',
  isActive: false
};

TabPanel.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  tabId: PropTypes.string.isRequired,
  isActive: PropTypes.bool
};

export default TabPanel;
