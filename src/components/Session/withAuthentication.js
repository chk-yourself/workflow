import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {
  currentUserActions,
  currentUserSelectors
} from '../../ducks/currentUser';
import { getDisplayName } from '../../utils/react';

const withAuthentication = WrappedComponent => {
  class WithAuthentication extends Component {
    state = {
      authUser: null
    };

    async componentDidMount() {
      const {
        firebase,
        history,
        syncCurrentUserData,
        setCurrentUser
      } = this.props;

      this.listener = await firebase.auth.onAuthStateChanged(async authUser => {
        if (authUser) {
          const { uid, emailVerified } = authUser;
          console.log(emailVerified);
          /*
          if (emailVerified) {
            this.unsubscribe = await syncCurrentUserData(uid);
            firebase.initPresenceDetection(uid);
            history.push(`/0/home/${uid}`);
          } else {
            history.push(ROUTES.VERIFICATION_REQUIRED);
          }
          */
          if (emailVerified) {
            this.unsubscribe = await syncCurrentUserData(uid);
            firebase.initPresenceDetection(uid);
            history.push(`/0/home/${uid}`);
          } else {
            this.setState({ authUser });
            history.push(ROUTES.VERIFICATION_REQUIRED);
          }
        } else if (firebase.auth.isSignInWithEmailLink(window.location.href)) {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            email = window.prompt('Please provide your email for confirmation');
          }
          firebase.auth
            .signInWithEmailLink(email, window.location.href)
            .then(async result => {
              window.localStorage.removeItem('emailForSignIn');
              if (result.additionalUserInfo.isNewUser) {
                this.setState({ authUser });
                history.push(ROUTES.SET_UP);
              } else {
                const { uid } = result.User;
                this.unsubscribe = await syncCurrentUserData(uid);
                firebase.initPresenceDetection(uid);
                history.push(`/0/home/${uid}`);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          history.push(ROUTES.LOG_IN);
          if (this.unsubscribe) {
            this.unsubscribe();
          }
          setCurrentUser(null);
        }
      });
    }

    componentWillUnmount() {
      this.listener();
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    render() {
      const { currentUser } = this.props;
      const { authUser } = this.state;
      return (
        <AuthUserContext.Provider value={currentUser || authUser}>
          <WrappedComponent {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  WithAuthentication.displayName = `WithAuthentication(${getDisplayName(
    WrappedComponent
  )})`;

  const mapStateToProps = state => {
    return {
      currentUser: currentUserSelectors.getCurrentUser(state)
    };
  };

  const mapDispatchToProps = dispatch => ({
    syncCurrentUserData: userId =>
      dispatch(currentUserActions.syncCurrentUserData(userId)),
    setCurrentUser: currentUser =>
      dispatch(currentUserActions.setCurrentUser(currentUser))
  });

  return compose(
    withRouter,
    withFirebase,
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
  )(WithAuthentication);
};

export default withAuthentication;
