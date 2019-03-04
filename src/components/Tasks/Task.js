import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox } from '../Checkbox';
import { Textarea } from '../Textarea';

export default class Task extends Component {
  constructor(props) {
    super(props);
  }

  onDragStart = e => {
    console.log('dragstart');
  };

  componentWillUnmount() {}

  render() {
    const {
      taskId,
      index,
      name,
      isCompleted,
      toggleCompleted,
      onChange,
      onBlur,
      onKeyDown
    } = this.props;

    return (
      <Draggable draggableId={taskId} index={index}>
        {(provided, snapshot) => (
          <li
            className="task"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Checkbox
              id={`cb-${taskId}`}
              value={taskId}
              name={taskId}
              isChecked={isCompleted}
              onChange={toggleCompleted}
              className="task__checkbox"
              labelClass="task__checkbox-label"
            />
            <Textarea
              value={name}
              onChange={onChange}
              onBlur={onBlur}
              name={taskId}
              className="task__textarea"
              onKeyDown={onKeyDown}
              onDragStart={this.onDragStart}
            />
          </li>
        )}
      </Draggable>
    );
  }
}
