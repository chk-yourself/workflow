import React from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export {default as PasswordForgetForm} from './PasswordForgetForm';
export {default as PasswordForgetPage} from './PasswordForget';
export {PasswordForgetLink};