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
import {
  userActions
} from '../../ducks/users';
import { activeWorkspaceActions } from '../../ducks/activeWorkspace';
import { getDisplayName } from '../../utils/react';

const withAuthentication = WrappedComponent => {
  class WithAuthentication extends Component {

    componentDidMount() {
      const {
        firebase,
        history,
        setCurrentUser,
        setActiveWorkspace,
        resetActiveWorkspace
      } = this.props;

      const { initPresenceDetection } = firebase;

      this.listener = firebase.auth.onAuthStateChanged(async authUser => {
        if (authUser) {
          const { uid, emailVerified } = authUser;
          if (emailVerified) {
            this.syncCurrentUser(uid);
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
          resetActiveWorkspace();
        }
      });
    }

    syncCurrentUser = async userId => {
      const { firebase, history, setCurrentUser, updateUser } = this.props;
      this.unsubscribeFromUser = await firebase
        .getDocRef('users', userId)
        .onSnapshot(snapshot => {
          const userData = snapshot.data() || null;
          const { currentUser } = this.props;
          if (!currentUser) {
            if (userData && userData.settings) {
              userData.tempSettings = {
                tasks: { ...userData.settings.tasks }
              };
            }
            setCurrentUser(userData);
            if (userData === null) {
              history.push(ROUTES.SET_UP);
            } else {
              history.push(`/0/home/${userId}`);
            }
          } else {
            updateUser({ userId, userData });
          }
    });
  }

    async componentDidUpdate(prevProps) {
      const { currentUser, syncActiveWorkspace, history, firebase } = this.props;
      if (!prevProps.currentUser && currentUser) {
        console.log('current user detected');
        const { userId } = currentUser;
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
    updateUser: ({ userId, userData }) =>
      dispatch(userActions.updateUser({userId, userData})),
    syncActiveWorkspace: workspaceId => dispatch(activeWorkspaceActions.syncActiveWorkspace(workspaceId)),
    setActiveWorkspace: workspace => dispatch(activeWorkspaceActions.setActiveWorkspace(workspace)),
    resetActiveWorkspace: () => dispatch(activeWorkspaceActions.resetActiveWorkspace())
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
