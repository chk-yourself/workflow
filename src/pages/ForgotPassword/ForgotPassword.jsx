import React from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Icon } from '../../components/Icon';
import * as ROUTES from '../../constants/routes';
import './ForgotPassword.scss';

const ForgotPasswordLink = () => (
  <p className="user-form__pw-forget">
    <Link to={ROUTES.FORGOT_PASSWORD} className="user-form__link link--sm">
      Forgot your password?
    </Link>
  </p>
);

const ForgotPasswordPage = () => (
  <main className="forgot-password">
    <div className="forgot-password__content">
      <h1 className="forgot-password__heading">Forgot your password?</h1>
      <ForgotPasswordForm />
      <Link to={ROUTES.LOG_IN} className="forgot-password__link">
        <Icon name="arrow-left" />
        Back to Login
      </Link>
    </div>
  </main>
);

export default ForgotPasswordPage;
export { ForgotPasswordLink };
