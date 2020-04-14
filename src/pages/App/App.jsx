import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
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
import { Guide } from '../Guide';
import { Portal } from '../../components/Portal';
import './App.scss';

class App extends Component {
  componentDidMount() {
    console.log('app mounted');
    const { history } = this.props;
    setTimeout(() => {
      this.scrollToElement(history.location.hash);
    }, 300);
    this.unsubscribe = history.listen(location => {
      const { hash } = location;
      this.scrollToElement(hash);
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  scrollToElement = hash => {
    if (hash === '') return;
    const id = hash.slice(1);
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  render() {
    const { firebase } = this.props;
    return (
      <div className="app">
        <Header />
        <Switch>
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route
            path={ROUTES.SET_UP}
            render={props => (firebase.currentUser ? <AccountSetup {...props} /> : null)}
          />
          <Route path={ROUTES.LOG_IN} component={LoginPage} />
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
          <Route
            path={ROUTES.BASE}
            render={props => <HomePage {...props} /> || <Redirect to={ROUTES.SET_UP} />}
          />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.VERIFICATION_REQUIRED} component={VerificationRequired} />
          <Route path={ROUTES.GUIDE} component={Guide} />
        </Switch>
        <Portal id="WORKFLOW_PORTAL" />
      </div>
    );
  }
}

export default withAuthentication(App);
