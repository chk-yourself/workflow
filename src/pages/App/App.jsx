import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as ROUTES from '../../constants/routes';
import { LandingPage } from '../Landing';
import { SignUpPage } from '../SignUp';
import { LoginPage } from '../Login';
import { ForgotPasswordPage } from '../ForgotPassword';
import { HomePage } from '../Home';
import { AdminPage } from '../Admin';
import { withAuthentication } from '../../components/Session';
import { Header } from '../../components/Header';
import { AccountSetup } from '../AccountSetup';
import { VerificationRequired } from '../VerificationRequired';

const App = ({ firebase, currentUser }) => (
  <>
    <Header />
    <Switch>
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route
        path={ROUTES.SET_UP}
        render={props => {
          return firebase.currentUser ? <AccountSetup /> : null;
        }}
      />
      <Route path={ROUTES.LOG_IN} component={LoginPage} />
      <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
      <Route
        path={ROUTES.BASE}
        render={props =>
          <HomePage {...props} /> || <Redirect to={ROUTES.SET_UP} />
        }
      />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route
        path={ROUTES.VERIFICATION_REQUIRED}
        component={VerificationRequired}
      />
    </Switch>
  </>
);
export default withAuthentication(App);
