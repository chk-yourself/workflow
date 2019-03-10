import React from 'react';
import SignInForm from './SignInForm';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { UserFormPage } from '../../components/UserFormPage';

const SignInPage = () => (
  <UserFormPage title="Log In">
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </UserFormPage>
);

export default SignInPage;
