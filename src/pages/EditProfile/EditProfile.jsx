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
    username: this.props.currentUser.username || ''
  };

  save = async e => {
    const { firebase, history, currentUser } = this.props;
    const { userId } = currentUser;
    await firebase.updateDoc(['users', userId], {});
    history.push(`/0/${userId}/profile`);
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { name: newName, username, about, linkedin, github } = this.state;
    const { currentUser } = this.props;
    const { name, photoURL } = currentUser;
    return (
      <Main classes={{ main: 'edit-profile' }}>
        <Button
          variant="outlined"
          color="primary"
          className="edit-profile__btn--save"
          onClick={this.save}
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
              label="Full Name"
              labelClass="edit-profile__label"
            />
          </EditProfileControlGroup>
          <EditProfileControlGroup>
            <Input
              name="username"
              id="editUsername"
              onChange={this.onChange}
              className="edit-profile__input"
              value={username}
              label="Username"
              labelClass="edit-profile__label"
            />
          </EditProfileControlGroup>
          <EditProfileControlGroup>
            <Textarea
              onChange={this.onChange}
              className="edit-profile__textarea"
              name="about"
              id="editAbout"
              value={about}
              label="About Me"
              labelClass="edit-profile__label"
            />
          </EditProfileControlGroup>
        </section>
        <section className="edit-profile__section edit-profile__social-links">
          <h2 className="edit-profile__subheading">Social Links</h2>
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
