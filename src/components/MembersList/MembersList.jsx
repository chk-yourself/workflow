import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { userActions, userSelectors } from '../../ducks/users';

class MembersList extends Component {
  state = {
    isLoading: true
  };

  async componentDidMount() {
    const { syncUserPresence } = this.props;
    this.unsubscribe = await syncUserPresence();
    this.setState({
      isLoading: false
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) return null;
    const { users } = this.props;
    return (
      <ul className="members">
        {users.map(user => {
          const { name, photoURL, userId } = user;
          return (
            <li className="members__member" key={userId}>
              <Avatar
                classes={{
                  avatar: `members__avatar--sm`,
                  placeholder: `members__avatar-placeholder--sm`
                }}
                name={name}
                size="sm"
                variant="circle"
                imgSrc={photoURL}
              />
              <span className="members__name">{name}</span>
            </li>
          );
        })}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  users: userSelectors.getUsersArray(state)
});

const mapDispatchToProps = dispatch => ({
  syncUserPresence: () => dispatch(userActions.syncUserPresence())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersList);
