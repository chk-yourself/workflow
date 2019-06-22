import React from 'react';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import SignUpForm from './SignUpForm';
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
  <FormPage title="Sign Up">
    <SignUpForm />
  </FormPage>
);

export default SignUpPage;
export { SignUpLink };
