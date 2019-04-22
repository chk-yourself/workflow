import React from 'react';
import { ForgotPasswordForm } from '../ForgotPassword';
import { PasswordChangeForm } from '../PasswordChange';
import { withAuthorization } from '../../components/Session';
import { UserFormPage } from '../../components/UserFormPage';
import './Account.scss';

const AccountPage = () => (
  <UserFormPage title="My Account">
    <section className="account-section">
      <h2 className="account-section__header">Forgot your password?</h2>
      <ForgotPasswordForm />
    </section>
    <section className="account-section">
      <h2 className="account-section__header">Change your password.</h2>
      <PasswordChangeForm />
    </section>
  </UserFormPage>
);

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(AccountPage);
