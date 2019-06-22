import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { RadioGroup } from '../Radio';
import './Workspace.scss';

class WorkspaceSelect extends Component {
  selectWorkspace = e => {
    const { value: workspaceId } = e.target;
    const { firebase, currentUser } = this.props;
    const { userId } = currentUser;
    firebase.updateDoc(['users', userId], {
      'settings.activeWorkspace': workspaceId
    });
    console.log(`selected workspace: ${workspaceId}`);
  };

  render() {
    const { currentUser, activeWorkspace } = this.props;
    const { workspaces } = currentUser;
    const options = Object.keys(workspaces).map(workspaceId => ({
      value: workspaceId,
      label: workspaces[workspaceId].name
    }));
    return (
      <RadioGroup
        name="activeWorkspace"
        onChange={this.selectWorkspace}
        options={options}
        value={activeWorkspace.workspaceId}
        classes={{
          label: 'workspace-select__label',
          list: 'workspace-select__list'
        }}
      />
    );
  }
}

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(WorkspaceSelect);
