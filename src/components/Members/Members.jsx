import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
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
  activeWorkspace,
  includeProfileLink
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
              avatar: `members__avatar members__avatar--sm ${classes.avatar || ''}`,
              placeholder: `members__avatar-placeholder--sm ${classes.placeholder || ''}`
            }}
            name={name}
            size="sm"
            variant="circle"
            src={photoURL}
            showOnlineStatus={showOnlineStatus}
            isOnline={isOnline}
          />
          {details.map(detail => (
            <span
              key={detail}
              className={`members__detail members__${detail} ${
                classes.detail ? `${classes.detail} ${classes.detail}--${detail}` : ''
              }`}
            >
              {detail === 'displayName' ? (
                includeProfileLink ? (
                  <Link
                    to={`/0/${userId}/profile`}
                    className={`members__link ${classes.link || ''}`}
                  >{`@${user[detail]}`}</Link>
                ) : (
                  `@${user[detail]}`
                )
              ) : (
                user[detail]
              )}
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
  includeProfileLink: true,
  details: ['name', 'displayName', 'email']
};

Members.propTypes = {
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  showOnlineStatus: PropTypes.bool,
  includeProfileLink: PropTypes.bool,
  details: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.shape({
    list: PropTypes.string,
    item: PropTypes.string,
    avatar: PropTypes.string,
    placeholder: PropTypes.string,
    detail: PropTypes.string
  })
};

const mapStateToProps = state => ({
  users: userSelectors.getUsersArray(state)
});

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default compose(
  withAuthorization(condition),
  connect(mapStateToProps)
)(Members);
