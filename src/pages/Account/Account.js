import React from 'react';
import { connect } from 'react-redux';
import { PasswordForgetForm } from '../PasswordForget';
import { PasswordChangeForm } from '../PasswordChange';
import {
  currentUserActions,
  currentUserSelectors
} from '../../ducks/currentUser';
import { AuthUserContext, withAuthorization } from '../../components/Session';
import { UserFormPage } from '../../components/UserFormPage';
import './Account.scss';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <UserFormPage title="My Account">
        <section className="account-section">
        <h2 className="account-section__header">Forgot your password?</h2>
          <PasswordForgetForm />
        </section>
        <section className="account-section">
        <h2 className="account-section__header">Change your password.</h2>
          <PasswordChangeForm />
        </section>
        </UserFormPage>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

const mapStateToProps = state => {
  return {
    currentUser: currentUserSelectors.getCurrentUser(state)
  }
};

const mapDispatchToProps = dispatch => {
  return {
    
  }
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccountPage)
);
