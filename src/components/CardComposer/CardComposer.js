import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '../Icon';
import { withAuthorization } from '../Session';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { currentUserSelectors } from '../../ducks/currentUser';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import * as keys from '../../constants/keys';
import './CardComposer.scss';

const INITIAL_STATE = {
  name: '',
  isActive: false
};

class CardComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  resetForm = () => {
    this.setState({ name: '' });
  };

  onSubmit = e => {
    const { name } = this.state;
    if ((e.type === 'keydown' && e.key !== keys.ENTER) || !name) return;
    const {
      firebase,
      projectId,
      projectName,
      listId,
      listName,
      currentUser,
      activeWorkspace
    } = this.props;
    const { userId } = currentUser;
    const { workspaceId } = activeWorkspace;
    firebase.createTask({
      projectId,
      listId,
      name,
      projectName,
      listName,
      userId,
      workspaceId
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

  onReset = e => {
    this.setState({ ...INITIAL_STATE });
  };

  onBlur = e => {
    if (e.target.value !== '') return;
    this.setState({
      isActive: false
    });
  };

  render() {
    const { name, isActive } = this.state;
    const isInvalid = name === '';

    return (
      <div
        className={`card-composer${isActive ? ' is-active' : ''}`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <form className="card-composer__form" onSubmit={this.onSubmit}>
          <Textarea
            onChange={this.onChange}
            value={name}
            placeholder={isActive ? 'Enter task name...' : 'Add a task'}
            isRequired
            name="name"
            className="card-composer__textarea"
            isAutoHeightResizeEnabled={false}
            onKeyDown={this.onSubmit}
          />
          {isActive && (
            <div className="card-composer__footer">
              <Button
                className="card-composer__btn"
                type="submit"
                onClick={this.onSubmit}
                color="primary"
                variant="contained"
                size="sm"
                disabled={isInvalid}
              >
                Add Task
              </Button>
              <Button
                className="card-composer__btn"
                type="reset"
                onClick={this.onReset}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>
    );
  }
}

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(CardComposer);
