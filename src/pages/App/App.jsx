import React from 'react';
import { Route, Switch } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { LandingPage } from '../Landing';
import { SignUpPage } from '../SignUp';
import { LoginPage } from '../Login';
import { PasswordForgetPage } from '../PasswordForget';
import { HomePage } from '../Home';
import { AdminPage } from '../Admin';
import { withAuthentication } from '../../components/Session';
import { Header } from '../../components/Header';

const App = () => (
  <>
    <Header />
    <Switch>
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.LOG_IN} component={LoginPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.BASE} component={HomePage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
    </Switch>
  </>
);
export default withAuthentication(App);
