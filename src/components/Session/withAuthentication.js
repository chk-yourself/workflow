import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null
      };
    }

    componentDidMount() {
      const { firebase, history } = this.props;

      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          this.setState({ authUser });
          history.push(`/0/home/${authUser.uid}`);
        } else {
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
  return compose(
    withRouter,
    withFirebase
  )(WithAuthentication);
};

export default withAuthentication;
