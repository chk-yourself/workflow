import React from 'react';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import SignUpForm from './SignUpForm';
import { SIGN_UP } from '../../constants/routes';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import './SignUp.scss';

const SignUpLink = () => (
  <p>
    Don't have an account?
    <Link className="link--outlined" to={SIGN_UP}>
      Sign Up
    </Link>
  </p>
);

const SignUpPage = () => {
  useDocumentTitle('Signup - Workflow');
  return (
    <FormPage title="Sign Up">
      <SignUpForm />
    </FormPage>
  );
};

export default SignUpPage;
export { SignUpLink };
