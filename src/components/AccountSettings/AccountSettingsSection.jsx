import React from 'react';
import PropTypes from 'prop-types';

const AccountSettingsSection = ({ title, children }) => (
  <section className="account-settings__section">
    <h2 className="account-settings__section-title">{title}</h2>
    {children}
  </section>
);

AccountSettingsSection.propTypes = {
  title: PropTypes.string.isRequired
};

export default AccountSettingsSection;
