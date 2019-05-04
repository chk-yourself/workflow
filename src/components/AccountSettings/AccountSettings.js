import React, { Component } from 'react';
import { ForgotPasswordForm } from '../../pages/ForgotPassword';
import { PasswordChangeForm } from '../../pages/PasswordChange';
import { withAuthorization } from '../Session';
import { UserFormPage } from '../UserFormPage';
import { Input } from '../Input';
import { Button } from '../Button';
import { ErrorMessage } from '../Error';
import { Modal } from '../Modal';
import './AccountSettings.scss';

class AccountSettings extends Component {
  state = {
    password: '',
    error: null
  };

  reset = () => {
    this.setState({
      password: '',
      error: null
    });
  };

  deactivateAccount = e => {
    const { currentUser, firebase, history } = this.props;
    const { userId, email } = currentUser;
    const { currentPassword } = this.state;
    const {
      reauthenticateWithEmailAuthCredential,
      deactivateAccount
    } = firebase;
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
    const { password, error } = this.state;
    const { onClose } = this.props;
    return (
      <Modal
        onModalClose={onClose}
        size="lg"
        classes={{ content: 'account-settings ' }}
      >
        <h1 className="account-settings__title">Account Settings</h1>
        <section className="account-settings__section">
          <h2 className="account-settings__section-title">
            Forgot your password?
          </h2>
          <p className="account-settings__info">
            Enter your email to receive instructions for resetting your
            password.
          </p>
          <ForgotPasswordForm />
        </section>
        <section className="account-settings__section">
          <h2 className="account-settings__section-title">
            Change your password.
          </h2>
          <PasswordChangeForm />
        </section>
        <section className="account-settings__section">
          <h2 className="account-settings__section-title">
            Deactivate your account.
          </h2>
          <p className="account-settings__info">
            Delete account and remove access to all workspaces in Workflow. This
            action cannot be undone. Please confirm you want to deactivate your
            account by re-entering your password.
          </p>
          <Input
            name="password"
            id="password"
            label="Password"
            value={password}
            onChange={this.onChange}
            type="password"
            className="account-settings__input"
            labelClass="account-settings__label"
          />
          <Button
            className="account-settings__btn account-settings__btn--deactivate-account"
            variant="contained"
            color="danger"
            disabled={password === ''}
            onClick={this.deactivateAccount}
          >
            Deactivate
          </Button>
          {error && <ErrorMessage text={error.message} />}
        </section>
      </Modal>
    );
  }
}

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(AccountSettings);
