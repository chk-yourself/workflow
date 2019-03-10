import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { authUserActions } from '../../ducks/authUser';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null
      };
    }

    componentDidMount() {
      const { firebase, history, fetchAuthUserData, setAuthUser } = this.props;

      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          fetchAuthUserData(authUser.uid);
          this.setState({ authUser });
          history.push(`/0/home/${authUser.uid}`);
        } else {
          setAuthUser(null);
          this.setState({ authUser: null });
        }
      });
    }

    componentWillUnmount() {
      this.listener();
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
    fetchAuthUserData: userId =>
      dispatch(authUserActions.fetchAuthUserData(userId)),
    setAuthUser: authUser => dispatch(authUserActions.setAuthUser(authUser))
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
