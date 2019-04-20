import React, { Component } from 'react';
import { Icon } from '../Icon';
import { withAuthorization } from '../Session';
import { currentUserSelectors } from '../../ducks/currentUser';
import { Input } from '../Input';
import { Button } from '../Button';
import * as keys from '../../constants/keys';
import './TaskComposer.scss';

const INITIAL_STATE = {
  name: '',
  isActive: false
};

class TaskComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  resetForm = () => {
    this.setState({ name: '' });
  };

  onSubmit = e => {
    const { name } = this.state;
    if (e.type === 'keydown' && e.key !== keys.ENTER || !name) return;
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
    firebase.addTask({
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
    this.resetForm();
    e.preventDefault();
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onFocus = e => {
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
          <Button
            className="task-composer__btn--submit"
            type="submit"
            onClick={this.onSubmit}
            iconOnly
          >
            <Icon name="plus-circle" />
          </Button>
          <Input
            onChange={this.onChange}
            value={name}
            placeholder="Add a task"
            isRequired
            name="name"
            className="task-composer__input"
            onKeyDown={this.onSubmit}
            hideLabel
          />
        </form>
      </div>
    );
  }
}

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(TaskComposer);
