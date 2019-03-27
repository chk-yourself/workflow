import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Main } from '../../components/Main';
import { userSelectors } from '../../ducks/users';
import './UserProfile.scss';

class UserProfile extends Component {
  render() {
    const { user } = this.props;
    return <Main className="user-profile" title={user.name} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state, ownProps.userId)
  };
};

export default connect(mapStateToProps)(UserProfile);
