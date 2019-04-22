import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { withAuthorization } from '../../components/Session';
import { Main } from '../../components/Main';
import { Avatar } from '../../components/Avatar';
import { Icon } from '../../components/Icon';
import { userSelectors } from '../../ducks/users';
import './Profile.scss';

const ContactInfo = ({ icon, children }) => (
  <div className="profile__contact-info">
    <Icon name={icon} />
    {children}
  </div>
);

const Profile = ({ user, currentUser, activeWorkspace }) => {
  if (!user) return null;
  const { members } = activeWorkspace;
  const {
    userId,
    name,
    photoURL,
    email,
    displayName,
    status,
    github,
    linkedin,
    about
  } = user;
  const { activeTaskCount, projectIds } = members[userId];
  const onlineStatus = status ? status.state : 'offline';
  const isCurrentUserProfile = currentUser.userId === userId;
  return (
    <Main classes={{ main: 'profile' }}>
      {isCurrentUserProfile && (
        <Link className="profile__link--edit" to={`/0/${userId}/edit-profile`}>
          Edit Profile
        </Link>
      )}
      <header className="profile__header">
        <Avatar
          classes={{
            avatar: 'profile__avatar',
            placeholder: 'profile__avatar-placeholder'
          }}
          name={name}
          size="lg"
          variant="circle"
          imgSrc={photoURL}
        />
        <h1 className="profile__name">{name}</h1>
        <p className="profile__display-name">@{displayName}</p>
        <p className={`profile__status is-${onlineStatus}`}>{onlineStatus}</p>
        {about && <p className="profile__about">{about}</p>}
      </header>
      <section className="profile__section profile__workspace-info">
        <div className="profile__counter">
          <div className="profile__count">{projectIds.length}</div>
          <div className="profile__counter-name">
            {`Project${projectIds.length === 1 ? '' : 's'}`}
          </div>
        </div>
        <div className="profile__counter">
          <div className="profile__count">{activeTaskCount}</div>
          <div className="profile__counter-name">
            {`Open Task${activeTaskCount === 1 ? '' : 's'}`}
          </div>
        </div>
      </section>
      <section className="profile__section profile__contact">
        <ContactInfo icon="mail">{email}</ContactInfo>
        {github && (
          <ContactInfo icon="github">
            <a
              target="_blank"
              href={`https://github.com/${github}`}
              className="profile__link"
            >
              {github}
            </a>
          </ContactInfo>
        )}
        {linkedin && (
          <ContactInfo icon="linkedin">
            <a
              target="_blank"
              href={`https://www.linkedin.com/in/${linkedin}`}
              className="profile__link"
            >
              {linkedin}
            </a>
          </ContactInfo>
        )}
      </section>
    </Main>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state, ownProps.userId)
  };
};

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default compose(
  connect(mapStateToProps),
  withAuthorization(condition)
)(Profile);
