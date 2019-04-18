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
import { activeWorkspaceActions } from '../../ducks/activeWorkspace';
import { getDisplayName } from '../../utils/react';

const withAuthentication = WrappedComponent => {
  class WithAuthentication extends Component {
    async componentDidMount() {
      const {
        firebase,
        history,
        syncCurrentUserData,
        setCurrentUser,
        setActiveWorkspace
      } = this.props;

      const { initPresenceDetection } = firebase;

      this.listener = await firebase.auth.onAuthStateChanged(async authUser => {
        if (authUser) {
          const { uid, emailVerified } = authUser;
          if (emailVerified) {
            this.unsubscribeFromUser = await syncCurrentUserData(uid);
           // initPresenceDetection(uid);
           console.log('is email verified');
            history.push(`/0/home/${uid}`);
          } else {
            history.push(ROUTES.VERIFICATION_REQUIRED);
          }
        } else if (firebase.auth.isSignInWithEmailLink(window.location.href)) {
          let email = window.localStorage.getItem('loginEmail');
          if (!email) {
            email = window.prompt('Please provide your email for confirmation');
          }
          firebase.auth
            .signInWithEmailLink(email, window.location.href)
            .then(async result => {
              window.localStorage.removeItem('loginEmail');
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          history.push(ROUTES.LOG_IN);
          if (this.unsubscribeFromUser) {
            this.unsubscribeFromUser();
            setCurrentUser(null);
          }
          if (this.unsubscribeFromWorkspace) {
            this.unsubscribeFromWorkspace();
            setActiveWorkspace(null);
          }
        }
      });
    }

    async componentDidUpdate(prevProps) {
      const { currentUser, syncActiveWorkspace } = this.props;
      if (!prevProps.currentUser && currentUser) {
        console.log('current user detected');
        const { activeWorkspace } = currentUser.settings;
        this.unsubscribeFromWorkspace = await syncActiveWorkspace(activeWorkspace);
      }
    }

    componentWillUnmount() {
      this.listener();
      if (this.unsubscribeFromUser) {
        this.unsubscribeFromUser();
      }
      if (this.unsubscribeFromWorkspace) {
        this.unsubscribeFromWorkspace();
      }
    }

    render() {
      const { currentUser } = this.props;
      return (
        <AuthUserContext.Provider value={currentUser}>
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
      dispatch(currentUserActions.setCurrentUser(currentUser)),
    syncActiveWorkspace: workspaceId => dispatch(activeWorkspaceActions.syncActiveWorkspace(workspaceId)),
    setActiveWorkspace: workspace => dispatch(activeWorkspaceActions.setActiveWorkspace(workspace))
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
