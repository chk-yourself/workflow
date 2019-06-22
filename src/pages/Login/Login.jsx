import React from 'react';
import { FormPage } from '../../components/FormPage';
import LoginForm from './LoginForm';
import { SignUpLink } from '../SignUp';
import './Login.scss';

const LoginPage = () => (
  <FormPage
    title="Log In"
    classes={{ main: 'login', footer: 'login__footer', title: 'login__title' }}
    footer={<SignUpLink />}
  >
    <LoginForm />
  </FormPage>
);

export default LoginPage;
