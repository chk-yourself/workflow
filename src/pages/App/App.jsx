import React, { Component } from 'react';
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
import { Tooltip } from '../../components/Tooltip';
import './App.scss';

class App extends Component {
  state = {
    tooltipAnchor: null,
    tooltipProps: {}
  };

  onMouseOver = e => {
    const { target } = e;
    const { tooltipAnchor } = this.state;
    if (!target.matches('[data-tooltip]') || tooltipAnchor === target) return;
    const { dataset } = target;
    const { tooltip, tooltipAlignY, tooltipAlignX, tooltipArrow } = dataset;
    this.setState({
      tooltipAnchor: target,
      tooltipProps: {
        text: tooltip,
        alignY: tooltipAlignY,
        alignX: tooltipAlignX,
        arrow: tooltipArrow
      }
    });
  };

  onMouseOut = e => {
    const { tooltipAnchor } = this.state;
    if (!tooltipAnchor) return;
    /*
    console.log('mouse out');
    this.setState({
      tooltipAnchor: null,
      tooltipProps: {}
    });
    */
  };

  render() {
    const { firebase, currentUser } = this.props;
    const { tooltipAnchor, tooltipProps } = this.state;
    console.log(tooltipAnchor, tooltipProps);
    return (
      <div
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        className="app"
      >
        <Header />
        <Switch>
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route
            path={ROUTES.SET_UP}
            render={props =>
              firebase.currentUser ? <AccountSetup {...props} /> : null
            }
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
        <Tooltip anchorEl={tooltipAnchor} {...tooltipProps} />
      </div>
    );
  }
}

export default withAuthentication(App);
