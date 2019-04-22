import React from 'react';
import { Link } from 'react-router-dom';
import PasswordForgetForm from './PasswordForgetForm';
import { UserFormPage } from '../../components/UserFormPage';
import * as ROUTES from '../../constants/routes';
import './PasswordForget.scss';

const PasswordForgetLink = () => (
  <p className="user-form__pw-forget">
    <Link to={ROUTES.PASSWORD_FORGET} className="user-form__link link--sm">
      Forgot your password?
    </Link>
  </p>
);

const PasswordForgetPage = () => (
  <main className="pw-forget">
  <div className="pw-forget__content">
    <h1 className="pw-forget__heading">Forgot your password?</h1>
    <PasswordForgetForm />
    </div>
  </main>
);

export default PasswordForgetPage;
export { PasswordForgetLink };
