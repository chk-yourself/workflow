import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { LandingPage } from '../Landing';
import { SignUpPage } from '../SignUp';
import { SignInPage } from '../SignIn';
import { PasswordForgetPage } from '../PasswordForget';
import { HomePage } from '../Home';
import { AccountPage } from '../Account';
import { AdminPage } from '../Admin';
import { withAuthentication } from '../../components/Session';
import { Header } from '../../components/Header';

class App extends Component {
  render() {
    return (
      <>
        <Header />
        <Switch>
          <Route
            exact
            path={ROUTES.LANDING}
            render={props => <LandingPage {...props} />}
          />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.APP} render={props => <HomePage {...props} />} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
        </Switch>
      </>
    );
  }
}

export default withAuthentication(App);
