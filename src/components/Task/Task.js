import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';
import { withFirebase } from '../Firebase';
import * as keys from '../../constants/keys';
import { currentActions, currentSelectors } from '../../ducks/current';
import './Task.scss';

class Task extends Component {
  state = {
    isFocused: false,
    name: this.props.name,
    prevPropsName: this.props.name
  };

  static getDerivedStateFromProps(props, state) {
    if (props.name !== state.prevPropsName) {
      return {
        name: props.name,
        prevPropsName: props.name
      };
    }
    return null;
  }

  onFocus = () => {
    this.setState({
      isFocused: true
    });
  };

  onChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  onBlur = () => {
    const { name, firebase, taskId } = this.props;
    const { name: newName } = this.state;
    if (name !== newName) {
      firebase.updateTask(taskId, {
        name: newName
      });
    }
    this.setState({
      isFocused: false
    });
  };

  deleteTask = e => {
    if (e.target.value !== '' || e.key !== keys.BACKSPACE) return;
    const { userId, taskId, firebase, listId, folderId, assignedTo, folders } = this.props;
    firebase.deleteTask({ taskId, listId, assignedTo, folders });
  };

  toggleCompleted = () => {
    const { taskId, isCompleted, firebase } = this.props;
    firebase.updateTask(taskId, {
      isCompleted: !isCompleted,
      completedAt: !isCompleted ? firebase.getTimestamp() : null
    });
  };

  handleTaskClick = e => {
    if (
      e.target.matches('button') ||
      e.target.matches('a') ||
      e.target.matches('label') ||
      e.target.matches('input[type="checkbox"]')
    )
      return;
    const { taskId, onTaskClick } = this.props;
    onTaskClick(taskId);
  };

  render() {
    const { taskId, isCompleted, innerRef, provided } = this.props;
    const { isFocused, name } = this.state;
    const draggableProps = provided
      ? provided.draggableProps
      : { style: { listStyle: 'none' } };
    const dragHandleProps = provided
      ? provided.dragHandleProps
      : { style: { listStyle: 'none' } };

    return (
      <li
        className={`task ${isFocused ? 'is-focused' : ''}`}
        onClick={this.handleTaskClick}
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
      >
        <Checkbox
          id={`cb-${taskId}`}
          value={taskId}
          name={taskId}
          isChecked={isCompleted}
          onChange={this.toggleCompleted}
          className="task__checkbox"
          labelClass="task__checkbox-label"
        />
        <Textarea
          value={name}
          onFocus={this.onFocus}
          onChange={this.onChange}
          onBlur={this.onBlur}
          name={taskId}
          className="task__textarea"
          onKeyDown={this.deleteTask}
        />
      </li>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: currentSelectors.getCurrentUserId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Task)
);
