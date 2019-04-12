import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import AuthUserContext from './context';
import * as ROUTES from '../../constants/routes';
import { getDisplayName } from '../../utils/react';

const withAuthorization = condition => WrappedComponent => {
  class WithAuthorization extends Component {
    /*
    componentDidMount() {
      const { firebase, history } = this.props;
      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          history.push(ROUTES.LOG_IN);
        }
      });
    }
    */

    componentWillUnmount() {
      //  this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {currentUser =>
            condition(currentUser) ? (
              <WrappedComponent currentUser={currentUser} {...this.props} />
            ) : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  WithAuthorization.displayName = `WithAuthorization(${getDisplayName(
    WrappedComponent
  )})`;

  return compose(
    withRouter,
    withFirebase
  )(WithAuthorization);
};

export default withAuthorization;
