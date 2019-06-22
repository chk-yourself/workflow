import React from 'react';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Icon } from '../../components/Icon';
import * as ROUTES from '../../constants/routes';
import './ForgotPassword.scss';

const ForgotPasswordLink = () => (
  <p className="forgot-password__text">
    <Link to={ROUTES.FORGOT_PASSWORD} className="form-page__link">
      Forgot your password?
    </Link>
  </p>
);

const ForgotPasswordPage = () => (
  <FormPage title="Forgot your password?" classes={{ title: 'forgot-password__title' }}>
    <ForgotPasswordForm />
    <Link to={ROUTES.LOG_IN} className="forgot-password__link">
      <Icon name="arrow-left" />
      Back to Login
    </Link>
  </FormPage>
);

export default ForgotPasswordPage;
export { ForgotPasswordLink };
