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
    name: this.props.activeWorkspace.name,
    invite: ''
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  resetInvite = () => {
    this.setState({
      invite: ''
    });
  };

  updateWorkspaceName = e => {
    e.preventDefault();
    const { firebase, currentUser, activeWorkspace } = this.props;
    const { name } = this.state;
    const { workspaceId, name: prevName, memberIds, invites } = activeWorkspace;
    if (prevName === name) return;
    const { updateWorkspaceName } = firebase;
    updateWorkspaceName({ workspaceId, name, memberIds, invites });
  };

  inviteMember = e => {
    e.preventDefault();
    const { invite } = this.state;
    const { firebase, currentUser, activeWorkspace } = this.props;
    const { workspaceId, name: workspaceName, invites: pendingInvites } = activeWorkspace;
    const { createWorkspaceInvite, updateDoc, addToArray } = firebase;
    const from = {
      userId: currentUser.userId,
      username: currentUser.username,
      name: currentUser.name
    };
    this.resetInvite();
    if (pendingInvites.includes(invite)) return;
    updateDoc(['workspaces', workspaceId], {
      invites: addToArray(invite)
    });
    createWorkspaceInvite({ email: invite, workspaceId, workspaceName, from });
  };

  render() {
    const { name, invite } = this.state;
    const { onClose, activeWorkspace } = this.props;
    const { invites } = activeWorkspace;
    const isNameInvalid = name === '';
    const isInviteInvalid = invite === '';
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
                    disabled={isNameInvalid}
                    type="submit"
                    className="workspace-settings__btn"
                    variant="contained"
                    color="primary"
                    onClick={this.updateWorkspaceName}
                    form="workspaceName"
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
                <>
                  <Members
                    classes={{
                      list: 'workspace-settings__members',
                      item: 'workspace-settings__member',
                      avatar: 'workspace-settings__avatar',
                      placeholder: 'workspace-settings__avatar-placeholder',
                      detail: 'workspace-settings__member-detail'
                    }}
                  />
                  {invites.length > 0 && (
                    <>
                  <h4 className="workspace-settings__sub-subheading">
                    Pending Invites
                  </h4>
                  <ul className="workspace-settings__pending-invites">
                  {invites.map(invite => (
                    <li key={invite} className="workspace-settings__pending-invite">
                    {invite}
                    </li>
                  ))}
                  </ul>
                  </>
                  )}
                  <h4 className="workspace-settings__sub-subheading">
                    Invite more members
                  </h4>
                  <form id="workspaceInvite">
                  <Input
                    name="invite"
                    value={invite}
                    onChange={this.onChange}
                    type="email"
                    className="workspace-settings__input workspace-settings__input--teammate-email"
                    placeholder="Teammate's email"
                    label="Email"
                    labelClass="workspace-settings__label"
                    form="workspaceInvite"
                  />
                  <Button
                    disabled={isInviteInvalid}
                    type="submit"
                    className="workspace-settings__btn"
                    variant="contained"
                    color="primary"
                    onClick={this.inviteMember}
                    form="workspaceInvite"
                  >
                    Invite
                  </Button>
                </form>
                </>
              )
            }
          ]}
        />
      </Modal>
    );
  }
}

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;
export default withAuthorization(condition)(WorkspaceSettings);
