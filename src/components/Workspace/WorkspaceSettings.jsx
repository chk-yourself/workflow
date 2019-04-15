import React, { Component } from 'react';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { withAuthorization } from '../Session';
import { Members } from '../Members';
import './Workspace.scss';

class WorkspaceSettings extends Component {
  state = {
    name: '',
    invites: ['', '', ''],
    currentSection: 'general'
  };

  onChange = e => {
    const { name, value, dataset } = e.target;
    const { index } = dataset;
    this.setState(prevState => {
      const invites = [...prevState.invites];
      if (name === 'invites') {
        invites[index] = value;
      }
      return {
        [name]: name === 'invites' ? invites : value
      };
    });
  };

  updateName = async e => {
    const { firebase, currentUser } = this.props;
    e.preventDefault();
  };

  inviteMembers = () => {};

  setSection = e => {
    const section = e.target.name;
    this.setState({
      currentSection: section
    });
  };

  render() {
    const { name, invites, currentSection } = this.state;
    const { onClose } = this.props;
    const isInvalid = name === '';
    return (
      <Modal
        onModalClose={onClose}
        size="lg"
        classes={{ content: 'workspace-settings ' }}
      >
        <h2 className="workspace-settings__heading">Workspace Settings</h2>
        <div className="workspace-settings__tabs">
          <div className="workspace-settings__tabs-wrapper">
            <Button
              name="general"
              onClick={this.setSection}
              className="workspace-setting__tab"
              variant="text"
              isActive={currentSection === 'general'}
            >
              General
            </Button>
            <Button
              name="members"
              onClick={this.setSection}
              className="workspace-setting__tab"
              variant="text"
              isActive={currentSection === 'members'}
            >
              Members
            </Button>
          </div>
        </div>
        <form className="workspace-settings__form">
          {currentSection === 'general' && (
            <section className="workspace-settings__section">
              <Input
                name="name"
                label="Workspace name"
                value={name}
                onChange={this.onChange}
                type="text"
                className="workspace-settings__input"
                labelClass="workspace-settings__label"
                data-section="workspace"
              />
              <Button
                disabled={isInvalid}
                type="submit"
                className="workspace-settings__btn"
                variant="contained"
                color="primary"
                onClick={this.updateName}
              >
                Update Workspace
              </Button>
            </section>
          )}
          {currentSection === 'members' && (
            <section className="workspace-settings__section">
              <h3 className="workspace-settings__subheading">Members</h3>
              <Members
                classes={{
                  list: 'workspace-settings__members',
                  item: 'workspace-settings__member',
                  avatar: 'workspace-settings__avatar',
                  placeholder: 'workspace-settings__avatar-placeholder',
                  detail: 'workspace-settings__member-detail'
                }}
              />
              <h4 className="workspace-settings__sub-subheading">
                Invite more members
              </h4>
              {invites.map((email, i) => (
                <Input
                  key={i}
                  name="invites"
                  value={email}
                  onChange={this.onChange}
                  type="email"
                  className="workspace-settings__input workspace-settings__input--teammate-email"
                  form="workspace"
                  placeholder="Teammate's email"
                  hideLabel
                  data-index={i}
                  data-section="workspace"
                />
              ))}
              <Button
                disabled={isInvalid}
                type="submit"
                className="workspace-settings__btn"
                variant="contained"
                color="primary"
                onClick={this.inviteMembers}
              >
                Invite Members
              </Button>
            </section>
          )}
        </form>
      </Modal>
    );
  }
}

const condition = currentUser => !!currentUser;
export default withAuthorization(condition)(WorkspaceSettings);
