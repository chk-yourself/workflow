import React, { Component } from 'react';
import { ForgotPasswordForm } from '../ForgotPassword';
import { PasswordChangeForm } from '../PasswordChange';
import { withAuthorization } from '../../components/Session';
import { UserFormPage } from '../../components/UserFormPage';
import { Button } from '../../components/Button';
import './AccountSettings.scss';

class AccountPage extends Component {
  deactivateAccount = e => {
    const { currentUser, firebase, history } = this.props;
    const { userId } = currentUser;
    firebase.deactivateAccount(userId);
  };

  render() {
    return (
  <UserFormPage classes={{ main: 'account-settings '}} title="Account Settings">
    <section className="account-settings__section">
      <h2 className="account-settings__section-header">Forgot your password?</h2>
      <ForgotPasswordForm />
    </section>
    <section className="account-settings__section">
      <h2 className="account-settings__section-header">Change your password.</h2>
      <PasswordChangeForm />
    </section>
    <section className="account-settings__section">
      <h2 className="account-settings__section-header">Deactivate account.</h2>
      <p className="account-settings__paragraph">This action cannot be undone.</p>
      <Button className="account-settings__btn account-settings__btn--deactivate-account" variant="outlined" onClick={this.deactivateAccount}>Deactivate account</Button>
    </section>
  </UserFormPage>
);
  }
}

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(AccountPage);
