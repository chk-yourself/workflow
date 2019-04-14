import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { Button } from '../../components/Button';
import ProfileSetup from './ProfileSetup';
import WorkspaceSetup from './WorkspaceSetup';
import './AccountSetup.scss';

const INITIAL_STATE = {
  profile: {
    username: '',
    name: '',
    about: ''
  },
  workspace: {
    name: '',
    invites: ['', '', '']
  },
  error: null,
  currentSection: 'profile'
};

class AccountSetup extends Component {
  state = { ...INITIAL_STATE };

  onSubmit = async e => {
    e.preventDefault();
    const { profile, workspace } = this.state;
    const { firebase, history } = this.props;
    const { uid: userId, email } = firebase.currentUser;
    await firebase.createAccount({ userId, email, profile, workspace });
    history.push(`/0/home/${userId}`);
    this.setState({ ...INITIAL_STATE });
  };

  onChange = e => {
    const { name, value, dataset } = e.target;
    const { section, index } = dataset;
    this.setState(prevState => {
      const invites = [...prevState.workspace.invites];
      if (name === 'invites') {
        invites[index] = value;
      }
      return {
        [section]: {
          ...prevState[section],
          [name]: name === 'invites' ? invites : value
        }
      };
    });
  };

  completeProfileSetup = () => {
    this.setState({
      currentSection: 'workspace'
    });
  };

  render() {
    const { profile, workspace, error, currentSection } = this.state;
    const { firebase } = this.props;
    const { currentUser } = firebase;
    if (!currentUser) return null;
    const isProfileInvalid = profile.name === '' || profile.username === '';
    const isWorkspaceInvalid = workspace.name === '';
    const { email } = currentUser;
    return (
      <main className="account-setup">
        <form className="account-setup__form">
          <h1 className="account-setup__heading">Set up your account</h1>
          {currentSection === 'profile' && (
            <ProfileSetup
              name={profile.name}
              username={profile.username}
              email={email}
              about={profile.about}
              onChange={this.onChange}
            />
          )}
          {currentSection === 'workspace' && (
            <WorkspaceSetup
              name={workspace.name}
              invites={workspace.invites}
              onChange={this.onChange}
            />
          )}
          <footer
            className={`account-setup__footer account-setup__footer--${currentSection}`}
          >
            <Button
              disabled={
                currentSection === 'profile'
                  ? isProfileInvalid
                  : isWorkspaceInvalid
              }
              size="md"
              variant="contained"
              color="primary"
              onClick={
                currentSection === 'profile'
                  ? this.completeProfileSetup
                  : this.onSubmit
              }
              className="account-setup__btn"
            >
              {currentSection === 'profile' ? 'Continue' : 'Create Workspace'}
            </Button>
          </footer>
        </form>
        {error && <p>{error.message}</p>}
      </main>
    );
  }
}

export default compose(
  withFirebase,
  withRouter
)(AccountSetup);
