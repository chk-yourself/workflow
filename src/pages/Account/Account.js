import React from 'react';
import { PasswordForgetForm } from '../PasswordForget';
import { PasswordChangeForm } from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../../components/Session';
import './Account.scss';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <main className="account">
        <h1>Account: {authUser.email}</h1>
        <section className="account__section">
        <h2>Forgot your password?</h2>
          <PasswordForgetForm />
        </section>
        <section className="account__section">
        <h2>Change your password.</h2>
          <PasswordChangeForm />
        </section>
      </main>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);
