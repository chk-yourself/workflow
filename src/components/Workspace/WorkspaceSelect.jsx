import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { RadioGroup } from '../Radio';
import './Workspace.scss';

class WorkspaceSelect extends Component {
  selectWorkspace = e => {
    const { value: workspaceId } = e.target;
    console.log(workspaceId);
  };

  render() {
    const { currentUser, activeWorkspace } = this.props;
    const { id } = activeWorkspace;
    const { workspaces, workspaceIds } = currentUser;
    const options = workspaceIds.map(workspaceId => ({
      value: workspaceId,
      name: workspaces[workspaceId].name
    }));
    return (
      <RadioGroup
        name="activeWorkspace"
        onChange={this.selectWorkspace}
        options={options}
        value={id}
        classes={{
          label: 'workspace-select__label',
          list: 'workspace-select__list'
        }}
      />
    );
  }
}

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(WorkspaceSelect);
