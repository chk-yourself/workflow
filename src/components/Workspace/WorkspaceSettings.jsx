import React, { Component } from 'react';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { withAuthorization } from '../Session';
import { Members } from '../Members';
import { TabsContainer } from '../Tabs';
import './WorkspaceSettings.scss';

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
        invites[+index] = value;
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
        <TabsContainer
          classes={{
            panel: 'workspace-settings__panel',
            tabs: 'workspace-settings__tabs'
          }}
          tabs={[
            {
              id: 'tabGeneral',
              panelId: 'panelGeneral',
              label: 'General',
              content: (
                <form id="workspaceName" onSubmit={this.updateName}>
                  <Input
                    name="name"
                    label="Workspace name"
                    value={name}
                    onChange={this.onChange}
                    type="text"
                    className="workspace-settings__input"
                    labelClass="workspace-settings__label"
                    data-section="workspace"
                    form="workspaceName"
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
                </form>
              )
            },
            {
              id: 'tabMembers',
              panelId: 'panelMembers',
              label: 'Members',
              content: (
                <form id="workspaceInvites">
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
                      placeholder="Teammate's email"
                      hideLabel
                      data-index={i}
                      data-section="workspace"
                      form="workspaceInvites"
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
                </form>
              )
            }
          ]}
        />
      </Modal>
    );
  }
}

const condition = currentUser => !!currentUser;
export default withAuthorization(condition)(WorkspaceSettings);
