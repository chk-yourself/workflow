import React from 'react';
import PasswordForgetForm from './PasswordForgetForm';
import { UserFormPage } from '../UserFormPage';

const PasswordForgetPage = () => (
  <UserFormPage title="Forgot your password?">
    <PasswordForgetForm />
  </UserFormPage>
);

export default PasswordForgetPage;
