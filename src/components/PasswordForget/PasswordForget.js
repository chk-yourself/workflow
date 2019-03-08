import React from 'react';
import { Link } from 'react-router-dom';
import PasswordForgetForm from './PasswordForgetForm';
import { UserFormPage } from '../UserFormPage';
import * as ROUTES from '../../constants/routes';
import './PasswordForget.scss';

const PasswordForgetLink = () => (
  <p className="user-form__info">
    <Link to={ROUTES.PASSWORD_FORGET} className="link--sm">
      Forgot Password?
    </Link>
  </p>
);

const PasswordForgetPage = () => (
  <UserFormPage title="Forgot your password?">
    <PasswordForgetForm />
  </UserFormPage>
);

export default PasswordForgetPage;
export { PasswordForgetLink };
