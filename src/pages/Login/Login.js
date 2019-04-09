import React from 'react';
import LoginForm from './LoginForm';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import './Login.scss';

const LoginPage = () => (
  <main className="login">
  <div className="login__content">
    <h1 className="login__heading">Log In</h1>
    <LoginForm />
    </div>
    <footer className="login__footer">
      <SignUpLink />
    </footer>
  </main>
);

export default LoginPage;
