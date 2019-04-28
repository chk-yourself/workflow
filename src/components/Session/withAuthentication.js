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
import { userActions } from '../../ducks/users';
import { activeWorkspaceActions } from '../../ducks/activeWorkspace';
import { getDisplayName } from '../../utils/react';

const withAuthentication = WrappedComponent => {
  class WithAuthentication extends Component {
    componentDidMount() {
      const {
        firebase,
        history,
        setCurrentUser,
        resetActiveWorkspace,
        syncCurrentUser
      } = this.props;

      const {
        location: { pathname }
      } = history;
      if (pathname === ROUTES.USER_GUIDE) return;

      this.authListener = firebase.auth.onAuthStateChanged(async authUser => {
        if (authUser) {
          const { uid, emailVerified, isAnonymous } = authUser;
          if (emailVerified) {
            this.userListener = await syncCurrentUser(uid, history);
          } else if (isAnonymous) {
            if (firebase.isNewUser(authUser)) {
              await firebase
                .createGuest(uid)
                .then(() => {
                  return firebase.createDemoProject(uid);
                })
                .then(async () => {
                  this.userListener = await syncCurrentUser(uid, history);
                })
                .catch(error => {
                  console.error(error);
                });
            } else {
              this.userListener = await syncCurrentUser(uid, history);
            }
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
          if (this.userListener) {
            this.userListener();
            setCurrentUser(null);
          }
          if (this.workspaceListener) {
            this.workspaceListener();
            resetActiveWorkspace();
          }
          if (this.tagListener) {
            this.tagListener();
          }
        }
      });
    }

    async componentDidUpdate(prevProps) {
      const {
        currentUser,
        syncActiveWorkspace,
        syncUserTags,
        resetActiveWorkspace,
        history
      } = this.props;
      if (!currentUser) return;
      const { userId, settings } = currentUser;
      const { activeWorkspace } = settings;
      if (!prevProps.currentUser) {
        console.log('current user detected');
        await Promise.all([
          syncActiveWorkspace(activeWorkspace),
          syncUserTags(userId)
        ])
          .then(listeners => {
            this.workspaceListener = listeners[0];
            this.tagListener = listeners[1];
          })
          .catch(error => {
            console.error(error);
          });
      }
      if (prevProps.currentUser) {
        const {
          activeWorkspace: prevWorkspace
        } = prevProps.currentUser.settings;
        if (prevWorkspace !== activeWorkspace) {
          // history.push(`/0/home/${userId}`);
          resetActiveWorkspace();
          this.workspaceListener();
          this.workspaceListener = await syncActiveWorkspace(activeWorkspace);
          console.log('changed active workspace');
        }
      }
    }

    componentWillUnmount() {
      if (this.authListener) {
        this.authListener();
      }
      if (this.userListener) {
        this.userListener();
      }
      if (this.workspaceListener) {
        this.workspaceListener();
      }
      if (this.tagListener) {
        this.tagListener();
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
    syncCurrentUser: (userId, history) =>
      dispatch(currentUserActions.syncCurrentUser(userId, history)),
    setCurrentUser: currentUser =>
      dispatch(currentUserActions.setCurrentUser(currentUser)),
    updateUser: ({ userId, userData }) =>
      dispatch(userActions.updateUser({ userId, userData })),
    syncActiveWorkspace: workspaceId =>
      dispatch(activeWorkspaceActions.syncActiveWorkspace(workspaceId)),
    setActiveWorkspace: workspace =>
      dispatch(activeWorkspaceActions.setActiveWorkspace(workspace)),
    resetActiveWorkspace: () =>
      dispatch(activeWorkspaceActions.resetActiveWorkspace()),
    syncUserTags: userId => dispatch(currentUserActions.syncUserTags(userId))
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
