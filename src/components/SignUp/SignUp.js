import React from 'react';
import SignUpForm from './SignUpForm';
import { UserFormPage } from '../UserFormPage';

const SignUpPage = () => (
  <UserFormPage title="Create an account">
    <SignUpForm />
  </UserFormPage>
);

export default SignUpPage;
