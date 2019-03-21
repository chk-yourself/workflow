import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { currentUserActions } from '../../ducks/currentUser';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null
      };
    }

    async componentDidMount() {
      const {
        firebase,
        history,
        syncCurrentUserData,
        setCurrentUser
      } = this.props;

      this.listener = firebase.auth.onAuthStateChanged(async authUser => {
        if (authUser) {
          this.unsubscribe = await syncCurrentUserData(authUser.uid);
          this.setState({ authUser });
          history.push(`/0/home/${authUser.uid}`);
        } else {
          history.push(ROUTES.SIGN_IN);
          if (this.unsubscribe) {
            this.unsubscribe();
          }
          setCurrentUser(null);
          this.setState({ authUser: null });
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
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

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
      null,
      mapDispatchToProps
    )
  )(WithAuthentication);
};

export default withAuthentication;
