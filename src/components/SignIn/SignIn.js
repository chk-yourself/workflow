import React from 'react';
import SignInForm from './SignInForm';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';

const SignInPage = () => (
  <main className="app__main">
    <h1>Sign In</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </main>
);

export default SignInPage;
