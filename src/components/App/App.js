import React, { Component } from 'react';
import './App.scss';
import { Route, Switch, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { Navigation } from '../Navigation';
import * as ROUTES from '../../constants/routes';
import { LandingPage } from '../Landing';
import { SignUpPage } from '../SignUp';
import { SignInPage } from '../SignIn';
import { PasswordForgetPage } from '../PasswordForget';
import { HomePage } from '../Home';
import { AccountPage } from '../Account';
import { AdminPage } from '../Admin';
import { withAuthentication } from '../Session';
import { Board } from '../Board';

class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="app__header">
          <Navigation classes="navbar" />
        </header>
        <Switch>
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
        </Switch>
      </div>
    );
  }
}

export default withAuthentication(App);