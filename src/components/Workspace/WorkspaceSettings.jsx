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
    newInvite: ''
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  resetInvite = () => {
    this.setState({
      newInvite: ''
    });
  };

  updateWorkspaceName = e => {
    e.preventDefault();
    const { firebase, activeWorkspace } = this.props;
    const { name } = this.state;
    const {
      workspaceId,
      name: prevName,
      memberIds,
      pendingInvites
    } = activeWorkspace;
    if (prevName === name) return;
    const { updateWorkspaceName } = firebase;
    updateWorkspaceName({ workspaceId, name, memberIds, pendingInvites });
  };

  inviteMember = e => {
    e.preventDefault();
    const { newInvite } = this.state;
    const { firebase, currentUser, activeWorkspace } = this.props;
    const {
      workspaceId,
      name: workspaceName,
      pendingInvites
    } = activeWorkspace;
    const { createWorkspaceInvite, updateDoc, addToArray } = firebase;
    const from = {
      userId: currentUser.userId,
      username: currentUser.username,
      name: currentUser.name
    };
    this.resetInvite();
    if (pendingInvites.includes(newInvite)) return;
    updateDoc(['workspaces', workspaceId], {
      pendingInvites: addToArray(newInvite)
    });
    createWorkspaceInvite({
      email: newInvite,
      workspaceId,
      workspaceName,
      from
    });
  };

  render() {
    const { name, newInvite } = this.state;
    const { onClose, activeWorkspace } = this.props;
    const { pendingInvites } = activeWorkspace;
    const isNameInvalid = name === '';
    const isInviteInvalid = newInvite === '';
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
                    id="workspaceEditName"
                    label="Workspace name"
                    value={name}
                    onChange={this.onChange}
                    type="text"
                    className="workspace-settings__input"
                    labelClass="workspace-settings__label"
                    data-section="workspace"
                    form="workspaceName"
                    isRequired
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
                  {pendingInvites.length > 0 && (
                    <>
                      <h4 className="workspace-settings__sub-subheading">
                        Pending Invites
                      </h4>
                      <ul className="workspace-settings__pending-invites">
                        {pendingInvites.map(email => (
                          <li
                            key={email}
                            className="workspace-settings__pending-invite"
                          >
                            {email}
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
                      name="newInvite"
                      id="newWorkspaceInvite"
                      value={newInvite}
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

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;
export default withAuthorization(condition)(WorkspaceSettings);
