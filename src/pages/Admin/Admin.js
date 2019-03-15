import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../../components/Session';
import { userActions, userSelectors } from '../../ducks/users';
import { currentUserActions, currentUserSelectors } from '../../ducks/currentUser';
import './Admin.scss';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: {}
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    /*
    this.props.firebase.users().on('value', snapshot => {
      this.setState({
        users: snapshot.val(),
        loading: false
      });
    });
    */
  }

  componentWillUnmount() {
    /*
    this.props.firebase.users().off();
    */
  }

  render() {
    return (
      <main className="admin">
        <h1>Admin</h1>
      </main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: currentUserSelectors.getCurrentUser(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUsersById: () => dispatch(userActions.fetchUsersById())
  };
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AdminPage)
);
