import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';
import { withFirebase } from '../Firebase';
import * as keys from '../../constants/keys';
import './Task.scss';

class Task extends Component {
  state = {
    isFocused: false,
    name: this.props.name
  };

  onDragStart = e => {
    console.log('dragstart');
  };

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
    /*
    const { taskId, firebase, listId, defaultKey } = this.props;
    firebase.deleteTask({ taskId, listId, defaultKey });
    */
  };

  toggleCompleted = () => {
    const { taskId, isCompleted, firebase } = this.props;
    firebase.updateTask(taskId, {
      isCompleted: !isCompleted,
      completedAt: !isCompleted ? firebase.getTimestamp() : null
    });
  };

  render() {
    const { taskId, index, isCompleted } = this.props;
    const { isFocused, name } = this.state;

    return (
      <Draggable draggableId={taskId} index={index}>
        {(provided, snapshot) => (
          <li
            className={`task ${isFocused ? 'is-focused' : ''}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
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
              onDragStart={this.onDragStart}
            />
          </li>
        )}
      </Draggable>
    );
  }
}

export default withFirebase(Task);
