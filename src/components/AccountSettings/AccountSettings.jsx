import React from 'react';
import AccountSettingsSection from './AccountSettingsSection';
import AccountDeactivationForm from './AccountDeactivationForm';
import { ForgotPasswordForm } from '../../pages/ForgotPassword';
import { PasswordChangeForm } from '../../pages/PasswordChange';
import { withAuthorization } from '../Session';
import { Modal } from '../Modal';
import './AccountSettings.scss';

const AccountSettings = ({ onClose }) => (
  <Modal onClose={onClose} size="lg" classes={{ content: 'account-settings ' }}>
    <h1 className="account-settings__title">Account Settings</h1>
    <AccountSettingsSection title="Forgot your password?">
      <p className="account-settings__info">
        Enter your email to receive instructions for resetting your password.
      </p>
      <ForgotPasswordForm
        classes={{
          input: 'account-settings__input',
          label: 'account-settings__label',
          button: 'account-settings__btn',
          form: 'account-settings__form'
        }}
      />
    </AccountSettingsSection>
    <AccountSettingsSection title="Change your password.">
      <PasswordChangeForm
        classes={{
          input: 'account-settings__input',
          label: 'account-settings__label',
          button: 'account-settings__btn',
          form: 'account-settings__form'
        }}
      />
    </AccountSettingsSection>
    <AccountSettingsSection title="Deactivate your account.">
      <p className="account-settings__info">
        Delete account and remove access to all workspaces in Workflow. This action cannot be
        undone. Please confirm you want to deactivate your account by re-entering your password.
      </p>
      <AccountDeactivationForm
        classes={{
          form: 'account-settings__form',
          input: 'account-settings__input',
          label: 'account-settings__label',
          button: 'account-settings__btn'
        }}
      />
    </AccountSettingsSection>
  </Modal>
);

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(AccountSettings);
