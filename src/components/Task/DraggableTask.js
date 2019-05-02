import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { taskSelectors } from '../../ducks/tasks';
import Task from './Task';

const DraggableTask = ({ taskId, index, isDragDisabled, tasksById }) => {
  if (!(taskId in tasksById)) return null;
  return (
    <Draggable
      draggableId={taskId}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Task
          taskId={taskId}
          innerRef={provided.innerRef}
          provided={provided}
          className={snapshot.isDragging ? 'is-dragging' : ''}
        />
      )}
    </Draggable>
  );
};

DraggableTask.defaultProps = {
  isDragDisabled: false
};

const mapStateToProps = state => ({
  tasksById: taskSelectors.getTasksById(state)
});

export default connect(mapStateToProps)(DraggableTask);
