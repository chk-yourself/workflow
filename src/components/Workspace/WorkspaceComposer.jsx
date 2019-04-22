import React, { Component } from 'react';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { withAuthorization } from '../Session';
import './Workspace.scss';

class WorkspaceComposer extends Component {
  state = {
    name: '',
    invites: ['', '', '']
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

  onSubmit = async e => {
    const { firebase, currentUser } = this.props;
    const { name, invites } = this.state;
    const user = {
      userId: currentUser.userId,
      name: currentUser.name,
      username: currentUser.username
    };
    await firebase.createWorkspace({ user, name, invites });
    e.preventDefault();
  };

  render() {
    const { name, invites } = this.state;
    const { onClose } = this.props;
    const isInvalid = name === '';
    return (
      <Modal
        onModalClose={onClose}
        size="md"
        classes={{ content: 'workspace-composer ' }}
      >
        <h3 className="workspace-composer__heading">Create new workspace</h3>
        <form className="workspace-composer__form" onSubmit={this.onSubmit}>
          <Input
            name="name"
            id="workspaceName"
            label="Workspace name"
            value={name}
            onChange={this.onChange}
            type="text"
            className="workspace-composer__input"
            labelClass="workspace-composer__label"
            data-section="workspace"
          />
          <h3 className="workspace-composer__subheading">
            Your team (optional)
          </h3>
          {invites.map((email, i) => (
            <Input
              key={i}
              name="invites"
              value={email}
              onChange={this.onChange}
              type="email"
              className="workspace-composer__input workspace-composer__input--teammate-email"
              form="workspace"
              placeholder="Teammate's email"
              data-index={i}
              data-section="workspace"
            />
          ))}
          <Button
            disabled={isInvalid}
            type="submit"
            className="workspace-composer__btn"
            variant="contained"
            color="primary"
            onClick={this.onSubmit}
          >
            Create Workspace
          </Button>
        </form>
      </Modal>
    );
  }
}

const condition = currentUser => !!currentUser;
export default withAuthorization(condition)(WorkspaceComposer);
