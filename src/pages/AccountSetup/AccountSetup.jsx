import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { Button } from '../../components/Button';
import ProfileSetup from './ProfileSetup';
import WorkspaceSetup from './WorkspaceSetup';
import WorkspaceInvites from './WorkspaceInvites';
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
  invites: [],
  error: null,
  currentSection: 'profile',
  nextSection: 'workspace'
};

class AccountSetup extends Component {
  state = { ...INITIAL_STATE };

  async componentDidMount() {
    const { firebase } = this.props;
    const { currentUser } = firebase;
    const { email } = currentUser;
    const invites = await firebase.fs.collection('invites')
    .where('to', '==', email)
    .where('type', '==', 'workspace')
    .get()
    .then(snapshot => {
      let workspaceInvites = [];
      snapshot.forEach(doc => {
        const content = doc.data();
        const workspaceInvite = {
          id: content.data.id,
          name: content.data.name,
          from: {...content.from},
          isAccepted: false
        };
        workspaceInvites = workspaceInvites.concat(workspaceInvite);
      })
      return workspaceInvites;
    });
    this.setState({
      invites,
      nextSection: invites.length > 0 ? 'invites' : 'workspace'
    });
  }

  onSubmit = async e => {
    e.preventDefault();
    const { profile, workspace, invites } = this.state;
    const { firebase, history } = this.props;
    const workspaceIds = invites.filter(invite => invite.isAccepted).map(acceptedInvite => acceptedInvite.id);
    workspace.invites = workspace.invites.filter(invite => invite !== '');
    const { uid: userId, email } = firebase.currentUser;
    await firebase.createAccount({ userId, email, profile, workspaceIds, workspace: workspace.name ? workspace : null });
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

  goToNextSection = () => {
    this.setState(prevState => ({
      currentSection: prevState.nextSection,
      nextSection: prevState.currentSection === 'invites' ? 'workspace' : null
    }));
  };

  acceptWorkspaceInvite = e => {
    const { value: workspaceId, dataset: { index }} = e.target;
    this.setState(prevState => {
      const invites = [...prevState.invites];
      let invite = {...invites[index]};
      invite.isAccepted = !invite.isAccepted;
      return {
        invites
      }
    });
  };

  render() {
    const { profile, workspace, error, currentSection, invites } = this.state;
    const { firebase } = this.props;
    const { currentUser } = firebase;
    if (!currentUser) return null;
    const isProfileInvalid = profile.name === '' || profile.username === '';
    const isWorkspaceInvalid = workspace.name === '' && invites.every(invite => !invite.isAccepted);
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
          {currentSection === 'invites' && (
            <WorkspaceInvites invites={invites} onChange={this.acceptWorkspaceInvite} />
          )
          }
          {currentSection === 'workspace' && (
            <WorkspaceSetup
              isOptional={invites.length > 0 && invites.some(invite => invite.isAccepted)}
              name={workspace.name}
              invites={workspace.invites}
              onChange={this.onChange}
            />
          )}
          <footer
            className={`account-setup__footer account-setup__footer--${currentSection}`}
          >
          {currentSection === 'workspace' &&
          <Button
              disabled={isWorkspaceInvalid}
              size="md"
              variant="contained"
              color="primary"
              onClick={this.onSubmit}
              className="account-setup__btn"
            >
              Done
            </Button>
          }
          {currentSection !== 'workspace' && (
            <Button
              disabled={currentSection === 'profile' && isProfileInvalid}
              size="md"
              variant="contained"
              color="primary"
              onClick={this.goToNextSection}
              className="account-setup__btn"
            >
              Continue
            </Button>
          )}
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
