import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import { UserFormPage } from '../../components/UserFormPage';
import * as ROUTES from '../../constants/routes';
import './SignUp.scss';

const SignUpLink = () => (
  <p>
    Don't have an account?
    <Link className="link--outlined" to={ROUTES.SIGN_UP}>
      Sign Up
    </Link>
  </p>
);

const SignUpPage = () => (
  <UserFormPage title="Create an account">
    <SignUpForm />
  </UserFormPage>
);

export default SignUpPage;
export { SignUpLink };
