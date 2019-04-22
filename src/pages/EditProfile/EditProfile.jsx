import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withAuthorization } from '../../components/Session';
import { Main } from '../../components/Main';
import { Avatar } from '../../components/Avatar';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { userSelectors } from '../../ducks/users';
import './EditProfile.scss';

const EditProfileControlGroup = ({ children }) => (
  <div className="edit-profile__control-group">{children}</div>
);

class EditProfile extends Component {
  state = {
    about: this.props.currentUser.about || '',
    linkedin: this.props.currentUser.linkedin || '',
    github: this.props.currentUser.github || '',
    name: this.props.currentUser.name || '',
    displayName: this.props.currentUser.displayName || ''
  };

  save = async e => {
    const { firebase, history, currentUser } = this.props;
    const { userId } = currentUser;
    const { about, linkedin, github, name, displayName } = this.state;
    const isProfileChanged =
      about !== currentUser.about ||
      linkedin !== currentUser.linkedin ||
      github !== currentUser.github ||
      name !== currentUser.name ||
      displayName !== currentUser.displayName;
    const isOnlyNameChanged =
      name !== currentUser.name &&
      about === currentUser.about &&
      linkedin === currentUser.linkedin &&
      github === currentUser.github &&
      displayName === currentUser.displayName;
    const isNameChanged = name !== currentUser.name;
    if (isProfileChanged) {
      if (isOnlyNameChanged) {
        await firebase.updateUserName({ userId, name });
      } else if (isNameChanged) {
        await Promise.all([
          firebase.updateUserName({ userId, name }),
          firebase.updateDoc(['users', userId], {
            about,
            linkedin,
            github,
            displayName
          })
        ]);
      } else {
        await firebase.updateDoc(['users', userId], {
          about,
          linkedin,
          github,
          displayName
        });
      }
    }
    history.push(`/0/${userId}/profile`);
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { name: newName, displayName, about, linkedin, github } = this.state;
    const { currentUser } = this.props;
    const { name, photoURL } = currentUser;
    const isInvalid = newName === '';
    return (
      <Main classes={{ main: 'edit-profile' }}>
        <form className="edit-profile__form">
          <Button
            variant="outlined"
            color="primary"
            className="edit-profile__btn--save"
            onClick={this.save}
            disabled={isInvalid}
          >
            Save Changes
          </Button>
          <header className="edit-profile__header">
            <h1 className="edit-profile__heading">Edit Profile</h1>
            <Avatar
              classes={{
                avatar: 'edit-profile__avatar',
                placeholder: 'edit-profile__avatar-placeholder'
              }}
              name={name}
              size="lg"
              variant="circle"
              imgSrc={photoURL}
            />
          </header>
          <section className="edit-profile__section edit-profile__user-info">
            <EditProfileControlGroup>
              <Input
                name="name"
                id="editName"
                onChange={this.onChange}
                className="edit-profile__input"
                value={newName}
                label="Full name"
                labelClass="edit-profile__label"
                helper="*Required"
                helperClass="edit-profile__helper"
                isRequired
              />
            </EditProfileControlGroup>
            <EditProfileControlGroup>
              <Input
                name="displayName"
                id="editDisplayName"
                onChange={this.onChange}
                className="edit-profile__input"
                value={displayName}
                label="Display name"
                labelClass="edit-profile__label"
                helper="The name your teammates will use to @mention you in Workflow."
                helperClass="edit-profile__helper"
              />
            </EditProfileControlGroup>
            <EditProfileControlGroup>
              <Textarea
                onChange={this.onChange}
                className="edit-profile__textarea"
                name="about"
                id="editAbout"
                value={about}
                label="About me"
                labelClass="edit-profile__label"
              />
            </EditProfileControlGroup>
          </section>
          <section className="edit-profile__section edit-profile__social-links">
            <h2 className="edit-profile__subheading">Social links</h2>
            <EditProfileControlGroup>
              <Input
                name="github"
                id="github"
                onChange={this.onChange}
                className="edit-profile__input"
                value={github}
                label="github.com/"
                labelClass="edit-profile__label--contact"
              />
            </EditProfileControlGroup>
            <EditProfileControlGroup>
              <Input
                name="linkedin"
                id="linkedin"
                onChange={this.onChange}
                className="edit-profile__input"
                value={linkedin}
                label="linkedin.com/in/"
                labelClass="edit-profile__label--contact"
              />
            </EditProfileControlGroup>
          </section>
        </form>
      </Main>
    );
  }
}

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
)(EditProfile);
