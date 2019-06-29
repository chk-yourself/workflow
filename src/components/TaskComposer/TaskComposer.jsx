import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { Input } from '../Input';
import { IconButton } from '../Button';
import * as keys from '../../constants/keys';
import './TaskComposer.scss';

const INITIAL_STATE = {
  name: ''
};

class TaskComposer extends Component {
  state = { ...INITIAL_STATE, isActive: false };

  reset = () => {
    this.setState({ ...INITIAL_STATE });
  };

  onSubmit = e => {
    const { name } = this.state;
    if ((e.type === 'keydown' && e.key !== keys.ENTER) || !name) return;
    const {
      currentUser,
      activeWorkspace,
      folderId,
      firebase,
      projectId,
      projectName,
      listId,
      listName,
      dueDate
    } = this.props;
    const { userId } = currentUser;
    const { workspaceId } = activeWorkspace;
    firebase.createTask({
      dueDate: dueDate ? new Date(dueDate) : null,
      name,
      userId,
      workspaceId,
      folderId,
      projectId,
      projectName,
      listId,
      listName,
      isPrivate: !projectId
    });
    this.reset();
    e.preventDefault();
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onFocus = () => {
    this.setState({
      isActive: true
    });
  };

  onBlur = e => {
    if (e.target.value !== '') return;
    this.setState({
      isActive: false
    });
  };

  render() {
    const { name, isActive } = this.state;

    return (
      <div
        className={`task-composer${isActive ? ' is-active' : ''}`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <form className="task-composer__form" onSubmit={this.onSubmit}>
          <IconButton
            className="task-composer__btn--submit"
            type="submit"
            onClick={this.onSubmit}
            icon="plus-circle"
            label="Add task"
          />
          <Input
            onChange={this.onChange}
            value={name}
            placeholder="Add a task"
            name="name"
            className="task-composer__input"
            onKeyDown={this.onSubmit}
            isRequired
          />
        </form>
      </div>
    );
  }
}

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(TaskComposer);
