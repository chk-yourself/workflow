import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { userActions, userSelectors } from '../../ducks/users';
import './Members.scss';

class Members extends Component {

  render() {
    const { users, isExpanded } = this.props;
    return (
      <ul
        style={{ display: isExpanded ? 'block' : 'none' }}
        className="sidebar__list members__list"
      >
        {users.map(user => {
          const { name, photoURL, userId, isOnline } = user;
          return (
            <li className="sidebar__item members__item" key={userId}>
              <Avatar
                classes={{
                  avatar: `members__avatar members__avatar--sm ${
                    isOnline ? 'is-online' : ''
                  }`,
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
export default connect(mapStateToProps)(Members);
