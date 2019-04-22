import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Avatar } from '../Avatar';
import { userSelectors } from '../../ducks/users';
import { withAuthorization } from '../Session';
import './Members.scss';

const Members = ({
  users,
  style,
  classes,
  showOnlineStatus,
  details,
  activeWorkspace
}) => (
  <ul style={style} className={`members__list ${classes.list || ''}`}>
    {users.map(user => {
      const { photoURL, name, userId, status, settings } = user;
      const isOnline =
        status &&
        status.state === 'online' &&
        settings.activeWorkspace === activeWorkspace.workspaceId;
      return (
        <li className={`members__item ${classes.item || ''}`} key={userId}>
          <Avatar
            classes={{
              avatar: `members__avatar members__avatar--sm ${
                isOnline && showOnlineStatus ? 'is-online' : ''
              } ${classes.avatar || ''}`,
              placeholder: `members__avatar-placeholder--sm ${classes.placeholder ||
                ''}`
            }}
            name={name}
            size="sm"
            variant="circle"
            imgSrc={photoURL}
          />
          {details.map(detail => (
            <span
              key={detail}
              className={`members__detail members__${detail} ${
                classes.detail
                  ? `${classes.detail} ${classes.detail}--${detail}`
                  : ''
              }`}
            >
              {user[detail]}
            </span>
          ))}
        </li>
      );
    })}
  </ul>
);

Members.defaultProps = {
  classes: {
    list: '',
    item: '',
    avatar: '',
    placeholder: '',
    detail: ''
  },
  style: {},
  showOnlineStatus: false,
  details: ['name', 'displayName', 'email']
};

const mapStateToProps = state => ({
  users: userSelectors.getUsersArray(state)
});

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default compose(
  withAuthorization(condition),
  connect(mapStateToProps)
)(Members);
