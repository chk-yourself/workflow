import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Task from './Task';

const DraggableTask = ({
  taskId,
  index,
  onTaskClick,
  listId,
  folderId,
  task,
  isDragDisabled
}) => (
  <Draggable draggableId={taskId} index={index} isDragDisabled={isDragDisabled}>
    {(provided, snapshot) => (
      <Task
        innerRef={provided.innerRef}
        provided={provided}
        onTaskClick={onTaskClick}
        listId={listId}
        folderId={folderId}
        {...task}
      />
    )}
  </Draggable>
);

DraggableTask.defaultProps = {
  isDragDisabled: false
};

export default DraggableTask;
