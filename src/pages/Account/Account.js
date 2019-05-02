import React, { Component } from 'react';
import { ForgotPasswordForm } from '../ForgotPassword';
import { PasswordChangeForm } from '../PasswordChange';
import { withAuthorization } from '../../components/Session';
import { UserFormPage } from '../../components/UserFormPage';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/Error';
import './AccountSettings.scss';

class AccountPage extends Component {
  state = {
    currentPassword: '',
    error: null
  };

  reset = () => {
    this.setState({
      currentPassword: '',
      error: null
    });
  };

  deactivateAccount = e => {
    const { currentUser, firebase, history } = this.props;
    const { userId, email } = currentUser;
    const { currentPassword } = this.state;
    const { reauthenticateWithEmailAuthCredential, deactivateAccount} = firebase;
    reauthenticateWithEmailAuthCredential(email, currentPassword)
    .then(() => {
      deactivateAccount(userId);
      this.reset();
    })
    .catch(error => {
      this.setState({ error });
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { currentPassword, error } = this.state;
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
      <p className="account-settings__paragraph">This action cannot be undone. Please confirm you want to deactivate your account by re-entering your password.</p>
      <Input
          name="currentPassword"
          id="currentPassword"
          label="Current Password"
          value={currentPassword}
          onChange={this.onChange}
          type="password"
          className="user-form__input"
          labelClass="user-form__label"
        />
      <Button className="account-settings__btn account-settings__btn--deactivate-account" variant="outlined" onClick={this.deactivateAccount}>Deactivate account</Button>
      {error && <ErrorMessage text={error.message} />}
    </section>
  </UserFormPage>
);
  }
}

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(AccountPage);
